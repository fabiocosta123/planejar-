import {
  describe,
  expect,
  it
} from "vitest";

import { CurrentBalanceRule } from "../rules/current-balance.rules";

describe(
  "CurrentBalanceRule",
  () => {

    const rule =
      new CurrentBalanceRule();


    it(
      "deve calcular o saldo considerando saldo inicial e transações concluídas",
      () => {

        const result =
          rule.calculate(
            1000,
            [
              {
                amount: 500,
                type: "INCOME",
                transactionDate:
                  new Date("2026-08-05"),
                status: "COMPLETED"
              },
              {
                amount: 200,
                type: "EXPENSE",
                transactionDate:
                  new Date("2026-08-06"),
                status: "COMPLETED"
              }
            ],
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(1300);

      }
    );


    it(
      "não deve considerar transações pendentes",
      () => {

        const result =
          rule.calculate(
            1000,
            [
              {
                amount: 500,
                type: "INCOME",
                transactionDate:
                  new Date("2026-08-05"),
                status: "PENDING"
              }
            ],
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(1000);

      }
    );


    it(
      "não deve considerar transações canceladas",
      () => {

        const result =
          rule.calculate(
            1000,
            [
              {
                amount: 300,
                type: "EXPENSE",
                transactionDate:
                  new Date("2026-08-05"),
                status: "CANCELED"
              }
            ],
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(1000);

      }
    );


    it(
      "não deve considerar transações posteriores à data de referência",
      () => {

        const result =
          rule.calculate(
            1000,
            [
              {
                amount: 500,
                type: "INCOME",
                transactionDate:
                  new Date("2026-08-15"),
                status: "COMPLETED"
              }
            ],
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(1000);

      }
    );


    it(
      "deve calcular corretamente uma combinação de receitas e despesas",
      () => {

        const result =
          rule.calculate(
            2000,
            [
              {
                amount: 1000,
                type: "INCOME",
                transactionDate:
                  new Date("2026-08-01"),
                status: "COMPLETED"
              },
              {
                amount: 300,
                type: "EXPENSE",
                transactionDate:
                  new Date("2026-08-02"),
                status: "COMPLETED"
              },
              {
                amount: 250,
                type: "EXPENSE",
                transactionDate:
                  new Date("2026-08-03"),
                status: "COMPLETED"
              },
              {
                amount: 100,
                type: "INCOME",
                transactionDate:
                  new Date("2026-08-04"),
                status: "COMPLETED"
              }
            ],
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(2550);

      }
    );

  }
);