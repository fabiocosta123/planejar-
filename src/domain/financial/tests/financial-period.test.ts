import { describe, expect, it } from "vitest";
import { FinancialPeriod } from "../models/financial-period";


describe("FinancialPeriod", () => {

  it("deve criar um período válido", () => {

    const start = new Date("2026-01-01");
    const end = new Date("2026-01-31");


    const period = new FinancialPeriod(
      start,
      end
    );


    expect(period.startDate)
      .toEqual(start);


    expect(period.endDate)
      .toEqual(end);
  });


  it("não deve permitir data inicial maior que final", () => {

    const start = new Date("2026-02-01");
    const end = new Date("2026-01-01");


    expect(() => 
      new FinancialPeriod(
        start,
        end
      )
    ).toThrow();
  });


  it("deve verificar se uma data pertence ao período", () => {

    const period = new FinancialPeriod(
      new Date("2026-01-01"),
      new Date("2026-01-31")
    );


    expect(
      period.contains(
        new Date("2026-01-15")
      )
    ).toBe(true);


    expect(
      period.contains(
        new Date("2026-02-01")
      )
    ).toBe(false);
  });


});