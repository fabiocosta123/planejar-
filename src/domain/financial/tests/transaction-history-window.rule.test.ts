import { describe, expect, it } from "vitest";

import {
  FREE_HISTORY_MONTHS,
  resolveHistoryStart,
} from "../rules/transaction-history-window.rule";

describe("resolveHistoryStart", () => {
  const today = new Date(2026, 9, 3, 15, 30);

  it("limita a versão gratuita aos últimos 3 meses", () => {
    expect(FREE_HISTORY_MONTHS).toBe(3);
    expect(resolveHistoryStart("FREE", today)).toEqual(
      new Date(2026, 6, 3)
    );
  });

  it("não limita a versão Pro", () => {
    expect(resolveHistoryStart("PRO", today)).toBeNull();
  });
});
