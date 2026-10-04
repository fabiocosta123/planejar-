import { describe, expect, it } from "vitest";
import { SpendingLimitRule } from "../rules/spending-limit-rule";


describe("SpendingLimitRule", () => {

  it("deve identificar quando ultrapassou limite", () => {

    const rule = new SpendingLimitRule(1000);

    expect(
      rule.isExceeded(1200)
    ).toBe(true);

  });


  it("deve calcular valor restante", () => {

    const rule = new SpendingLimitRule(1000);

    expect(
      rule.remaining(600)
    ).toBe(400);

  });

});