import { describe, expect, it } from "vitest";

import {
  canAccessTightDay,
  paymentAmountMatches,
} from "../rules/plan-access.rule";

describe("canAccessTightDay", () => {
  it("libera o dia do aperto só no Pro", () => {
    expect(canAccessTightDay("PRO")).toBe(true);
    expect(canAccessTightDay("FREE")).toBe(false);
  });
});

describe("paymentAmountMatches", () => {
  it("aceita o mesmo valor em centavos", () => {
    expect(paymentAmountMatches(19.9, 19.9)).toBe(true);
    expect(paymentAmountMatches(19.9, 19.905)).toBe(true);
  });

  it("recusa valor diferente ou ausente", () => {
    expect(paymentAmountMatches(19.9, 19.89)).toBe(false);
    expect(paymentAmountMatches(19.9, null)).toBe(false);
  });
});
