import { randomUUID } from "crypto";

import { paymentAmountMatches } from "../domain/financial/rules/plan-access.rule";
import { readProCheckoutConfig, type ProCheckoutConfig } from "../integrations/mycredit/config";
import { myCreditClient, MyCreditError } from "../integrations/mycredit/client";
import type { PixLookup } from "../integrations/mycredit/pix";
import type { MyCreditWebhookEvent } from "../integrations/mycredit/pix";
import {
  pixChargesRepository,
  type PixChargeRecord,
} from "../repositories/pix-charges.repository";
import { settingsService } from "./settings.service";
import type { ProCheckoutView } from "../contracts/financial/pro-checkout.contract";

export class ProCheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProCheckoutError";
  }
}

export interface PixChargeStore {
  findReusablePending(userId: string, now: Date): Promise<PixChargeRecord | null>;
  createPending(input: {
    userId: string;
    idFaturaPag: string;
    amount: number;
    copyPaste: string;
    expiresAt: Date;
  }): Promise<PixChargeRecord>;
  findOwned(userId: string, idFaturaPag: string): Promise<PixChargeRecord | null>;
  findByFatura(idFaturaPag: string): Promise<PixChargeRecord | null>;
  grantPro(chargeId: string, userId: string, paidAt: Date): Promise<void>;
  refund(chargeId: string, userId: string, refundedAt: Date): Promise<void>;
  hasEvent(id: string): Promise<boolean>;
  rememberEvent(id: string, tipo: string, idFaturaPag: string): Promise<void>;
}

export interface PlanReader {
  getPlan(userId: string): Promise<"FREE" | "PRO">;
}

export interface PixGateway {
  createImmediatePix(input: {
    idFaturaPag: string;
    amount: number;
  }): Promise<{ copyPaste: string; expiresAt: Date }>;
  getPixStatus(idFaturaPag: string): Promise<PixLookup>;
  simulatePayment(idFaturaPag: string): Promise<void>;
}

function toView(charge: PixChargeRecord, sandbox: boolean): ProCheckoutView {
  return {
    amount: charge.amount,
    copyPaste: charge.copyPaste,
    expiresAt: charge.expiresAt.toISOString(),
    idFaturaPag: charge.idFaturaPag,
    sandbox,
  };
}

export class ProCheckoutService {
  constructor(
    private readonly store: PixChargeStore = pixChargesRepository,
    private readonly plans: PlanReader = {
      async getPlan(userId: string) {
        const settings = await settingsService.getSettings(userId);
        return settings.plan;
      },
    },
    private readonly gateway: PixGateway = myCreditClient,
    private readonly config: () => ProCheckoutConfig = readProCheckoutConfig
  ) {}

  async startCheckout(userId: string) {
    const plan = await this.plans.getPlan(userId);

    if (plan === "PRO") {
      return { kind: "already-pro" as const };
    }

    const config = this.config();

    if (!config.configured) {
      throw new ProCheckoutError(
        "A cobrança do Pro ainda não está configurada."
      );
    }

    const existing = await this.store.findReusablePending(userId, new Date());

    if (existing) {
      return {
        kind: "pending" as const,
        charge: toView(existing, config.sandbox),
      };
    }

    const idFaturaPag = randomUUID();

    let created: { copyPaste: string; expiresAt: Date };

    try {
      created = await this.gateway.createImmediatePix({
        idFaturaPag,
        amount: config.amount,
      });
    } catch (error) {
      if (error instanceof MyCreditError) {
        throw new ProCheckoutError(error.message);
      }

      throw new ProCheckoutError("Não foi possível gerar o PIX.");
    }

    const saved = await this.store.createPending({
      userId,
      idFaturaPag,
      amount: config.amount,
      copyPaste: created.copyPaste,
      expiresAt: created.expiresAt,
    });

    return {
      kind: "pending" as const,
      charge: toView(saved, config.sandbox),
    };
  }

  async confirm(userId: string, idFaturaPag: string) {
    const charge = await this.store.findOwned(userId, idFaturaPag);

    if (!charge) {
      throw new ProCheckoutError("Cobrança não encontrada.");
    }

    if (charge.status === "PAID") {
      return { kind: "paid" as const };
    }

    if (charge.status === "REFUNDED") {
      throw new ProCheckoutError("Este PIX foi estornado.");
    }

    const lookup = await this.lookup(idFaturaPag);

    if (lookup.status === "pending") {
      return {
        kind: "pending" as const,
        charge: toView(charge, this.config().sandbox),
      };
    }

    if (lookup.status !== "paid") {
      throw new ProCheckoutError("PIX não encontrado.");
    }

    if (!paymentAmountMatches(charge.amount, lookup.amount)) {
      throw new ProCheckoutError("O valor pago não confere com o Pro.");
    }

    await this.store.grantPro(charge.id, userId, new Date());

    return { kind: "paid" as const };
  }

  async simulate(userId: string, idFaturaPag: string) {
    if (!this.config().sandbox) {
      throw new ProCheckoutError(
        "A simulação de pagamento só existe no sandbox."
      );
    }

    const charge = await this.store.findOwned(userId, idFaturaPag);

    if (!charge || charge.status !== "PENDING") {
      throw new ProCheckoutError("Cobrança não encontrada.");
    }

    try {
      await this.gateway.simulatePayment(idFaturaPag);
    } catch (error) {
      if (error instanceof MyCreditError) {
        throw new ProCheckoutError(error.message);
      }

      throw new ProCheckoutError("Não foi possível simular o pagamento.");
    }

    return this.confirm(userId, idFaturaPag);
  }

  async applyWebhook(event: MyCreditWebhookEvent) {
    if (await this.store.hasEvent(event.id)) {
      return;
    }

    const charge = await this.store.findByFatura(event.idFaturaPag);

    if (!charge || !paymentAmountMatches(charge.amount, event.valor)) {
      await this.store.rememberEvent(event.id, event.tipo, event.idFaturaPag);
      return;
    }

    if (event.tipo === "pix.pago" && charge.status === "PENDING") {
      await this.store.grantPro(charge.id, charge.userId, new Date());
    }

    if (event.tipo === "pix.estornado" && charge.status === "PAID") {
      await this.store.refund(charge.id, charge.userId, new Date());
    }

    await this.store.rememberEvent(event.id, event.tipo, event.idFaturaPag);
  }

  private async lookup(idFaturaPag: string) {
    try {
      return await this.gateway.getPixStatus(idFaturaPag);
    } catch (error) {
      if (error instanceof MyCreditError) {
        throw new ProCheckoutError(error.message);
      }

      throw new ProCheckoutError("Não foi possível consultar o PIX.");
    }
  }
}

export const proCheckoutService = new ProCheckoutService();
