import { describe, expect, it } from "vitest";

import {
  acceptsMovementNotice,
  canNotifyBankMovement,
  noticeTitle,
  shouldNotifyPrincipal,
} from "../movement-notice";

describe("avisos de movimentação", () => {
  it("avisa o principal quando outra pessoa lança", () => {
    expect(shouldNotifyPrincipal("filho", "pai")).toBe(true);
  });

  it("não avisa o principal do próprio lançamento", () => {
    expect(shouldNotifyPrincipal("pai", "pai")).toBe(false);
  });

  it("reserva aviso bancário para o Pro", () => {
    expect(canNotifyBankMovement("PRO")).toBe(true);
    expect(canNotifyBankMovement("FREE")).toBe(false);
  });

  it("respeita quem desligou os avisos", () => {
    expect(acceptsMovementNotice("NONE")).toBe(false);
    expect(acceptsMovementNotice("IMPORTANT")).toBe(true);
    expect(acceptsMovementNotice("ALL")).toBe(true);
  });

  it("nomeia entrada e saída", () => {
    expect(noticeTitle("LEDGER_MOVEMENT", "EXPENSE")).toBe("Nova saída");
    expect(noticeTitle("LEDGER_MOVEMENT", "INCOME")).toBe("Nova entrada");
    expect(noticeTitle("BANK_MOVEMENT", "INCOME")).toBe("Entrada no banco");
    expect(noticeTitle("BANK_MOVEMENT", "EXPENSE")).toBe("Saída no banco");
  });
});
