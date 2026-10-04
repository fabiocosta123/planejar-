import { describe, expect, it } from "vitest";

import type { PixChargeRecord } from "../../repositories/pix-charges.repository";
import {
  ProCheckoutService,
  type PixChargeStore,
  type PixGateway,
  type PlanReader,
} from "../pro-checkout.service";
import type { ProCheckoutConfig } from "../../integrations/mycredit/config";

function setup() {
  const charges: PixChargeRecord[] = [];
  const events = new Set<string>();
  let plan: "FREE" | "PRO" = "FREE";
  let pixStatus: "pending" | "paid" | "missing" = "pending";
  let paidAmount: number | null = 19.9;

  const store: PixChargeStore = {
    async findReusablePending(userId, now) {
      return (
        charges.find(
          (charge) =>
            charge.userId === userId &&
            charge.status === "PENDING" &&
            charge.expiresAt > now
        ) ?? null
      );
    },
    async createPending(input) {
      const charge: PixChargeRecord = {
        id: `charge-${charges.length + 1}`,
        status: "PENDING",
        ...input,
      };
      charges.push(charge);
      return charge;
    },
    async findOwned(userId, idFaturaPag) {
      return (
        charges.find(
          (charge) =>
            charge.userId === userId && charge.idFaturaPag === idFaturaPag
        ) ?? null
      );
    },
    async findByFatura(idFaturaPag) {
      return charges.find((charge) => charge.idFaturaPag === idFaturaPag) ?? null;
    },
    async grantPro(chargeId, userId) {
      const charge = charges.find((item) => item.id === chargeId && item.userId === userId);
      if (charge && charge.status === "PENDING") {
        charge.status = "PAID";
      }
      plan = "PRO";
    },
    async refund(chargeId, userId) {
      const charge = charges.find((item) => item.id === chargeId && item.userId === userId);
      if (charge && charge.status === "PAID") {
        charge.status = "REFUNDED";
      }
      if (!charges.some((item) => item.userId === userId && item.status === "PAID")) {
        plan = "FREE";
      }
    },
    async hasEvent(id) {
      return events.has(id);
    },
    async rememberEvent(id) {
      events.add(id);
    },
  };

  const plans: PlanReader = {
    async getPlan() {
      return plan;
    },
  };

  const gateway: PixGateway = {
    async createImmediatePix() {
      return {
        copyPaste: "000201",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
    },
    async getPixStatus() {
      if (pixStatus === "paid") {
        return { status: "paid", amount: paidAmount };
      }
      if (pixStatus === "missing") {
        return { status: "missing" };
      }
      return { status: "pending" };
    },
    async simulatePayment() {
      pixStatus = "paid";
    },
  };

  const config: ProCheckoutConfig = {
    amount: 19.9,
    apiBase: "https://sandboxapi.mycredit.com.br",
    cnpj: "99999999999999",
    integratorKey: "chave",
    webhookToken: "token",
    sandbox: true,
    configured: true,
  };

  const service = new ProCheckoutService(store, plans, gateway, () => config);

  return {
    service,
    charges,
    events,
    getPlan: () => plan,
    setPixStatus: (status: typeof pixStatus) => {
      pixStatus = status;
    },
    setPaidAmount: (amount: number | null) => {
      paidAmount = amount;
    },
    setPlan: (next: "FREE" | "PRO") => {
      plan = next;
    },
  };
}

describe("ProCheckoutService", () => {
  it("não gera PIX para quem já é Pro", async () => {
    const { service, charges, setPlan } = setup();
    setPlan("PRO");

    await expect(service.startCheckout("user-1")).resolves.toEqual({
      kind: "already-pro",
    });
    expect(charges).toHaveLength(0);
  });

  it("só libera o Pro quando a MyCredit confirma o valor", async () => {
    const { service, getPlan, setPixStatus, setPaidAmount } = setup();
    const started = await service.startCheckout("user-1");

    if (started.kind !== "pending") {
      throw new Error("esperava cobrança pendente");
    }

    await expect(
      service.confirm("user-1", started.charge.idFaturaPag)
    ).resolves.toMatchObject({ kind: "pending" });
    expect(getPlan()).toBe("FREE");

    setPixStatus("paid");
    setPaidAmount(1);
    await expect(
      service.confirm("user-1", started.charge.idFaturaPag)
    ).rejects.toThrow("O valor pago não confere com o Pro.");
    expect(getPlan()).toBe("FREE");

    setPaidAmount(19.9);
    await expect(
      service.confirm("user-1", started.charge.idFaturaPag)
    ).resolves.toEqual({ kind: "paid" });
    expect(getPlan()).toBe("PRO");
  });

  it("ignora webhook duplicado e devolve o plano no estorno", async () => {
    const { service, events, getPlan, charges } = setup();
    const started = await service.startCheckout("user-1");

    if (started.kind !== "pending") {
      throw new Error("esperava cobrança pendente");
    }

    const paid = {
      id: "event-1",
      tipo: "pix.pago" as const,
      idFaturaPag: started.charge.idFaturaPag,
      valor: 19.9,
    };

    await service.applyWebhook(paid);
    await service.applyWebhook(paid);

    expect(getPlan()).toBe("PRO");
    expect(events.size).toBe(1);
    expect(charges[0]?.status).toBe("PAID");

    await service.applyWebhook({
      id: "event-2",
      tipo: "pix.estornado",
      idFaturaPag: started.charge.idFaturaPag,
      valor: 10,
    });
    expect(getPlan()).toBe("PRO");

    await service.applyWebhook({
      id: "event-3",
      tipo: "pix.estornado",
      idFaturaPag: started.charge.idFaturaPag,
      valor: 19.9,
    });
    expect(getPlan()).toBe("FREE");
    expect(charges[0]?.status).toBe("REFUNDED");
  });
});
