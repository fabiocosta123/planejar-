import { describe, expect, it } from "vitest";

import { FinancialFlowEntry } from "../models/financial-flow-entry";


describe("FinancialFlowEntry", () => {

  it("deve representar uma entrada financeira positiva", () => {

    const entry =
      new FinancialFlowEntry(
        new Date("2026-08-08"),
        1000,
        300,
        1700
      );


    expect(entry.date)
      .toEqual(
        new Date("2026-08-08")
      );


    expect(entry.income)
      .toBe(1000);


    expect(entry.expenses)
      .toBe(300);


    expect(entry.balance)
      .toBe(1700);


    expect(entry.isPositive)
      .toBe(true);


    expect(entry.isNegative)
      .toBe(false);

  });


  it("deve identificar saldo negativo", () => {

    const entry =
      new FinancialFlowEntry(
        new Date("2026-08-10"),
        0,
        500,
        -200
      );


    expect(entry.balance)
      .toBe(-200);


    expect(entry.isPositive)
      .toBe(false);


    expect(entry.isNegative)
      .toBe(true);

  });


  it("saldo zero deve ser considerado positivo", () => {

    const entry =
      new FinancialFlowEntry(
        new Date("2026-08-10"),
        0,
        300,
        0
      );


    expect(entry.isPositive)
      .toBe(true);


    expect(entry.isNegative)
      .toBe(false);

  });

});