import { describe, expect, it } from "vitest";
import { FutureBalanceResult } from "../models/future-balance-result";


describe("FutureBalanceResult", () => {

  it("deve calcular o saldo futuro corretamente", () => {

    const result =
      new FutureBalanceResult(
        1000,
        500,
        300
      );


    expect(result.currentBalance)
      .toBe(1000);


    expect(result.futureIncome)
      .toBe(500);


    expect(result.futureExpenses)
      .toBe(300);


    expect(result.futureBalance)
      .toBe(1200);

  });


  it("deve identificar saldo futuro positivo", () => {

    const result =
      new FutureBalanceResult(
        1000,
        500,
        300
      );


    expect(result.isPositive)
      .toBe(true);


    expect(result.isNegative)
      .toBe(false);

  });


  it("deve identificar saldo futuro negativo", () => {

    const result =
      new FutureBalanceResult(
        1000,
        200,
        1500
      );


    expect(result.futureBalance)
      .toBe(-300);


    expect(result.isPositive)
      .toBe(false);


    expect(result.isNegative)
      .toBe(true);

  });


  it("deve considerar corretamente quando o saldo futuro é exatamente zero", () => {

    const result =
      new FutureBalanceResult(
        1000,
        500,
        1500
      );


    expect(result.futureBalance)
      .toBe(0);


    expect(result.isPositive)
      .toBe(true);


    expect(result.isNegative)
      .toBe(false);

  });

});