import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import {
  calculateFutureBalanceAction
} from "../calculate-future-balance.action";

import {
  transactionsService
} from "../../../services/transactions.service";

import {
  FutureBalanceResult
} from "../../../domain/financial/models/future-balance-result";


describe(
  "calculateFutureBalanceAction",
  () => {


    beforeEach(() => {

      vi.restoreAllMocks();

    });


    it(
      "deve calcular e retornar o saldo futuro como contrato",
      async () => {

        const futureBalance =
          new FutureBalanceResult(
            1000,
            500,
            300
          );


        vi.spyOn(
          transactionsService,
          "calculateFutureBalance"
        )
          .mockResolvedValue(
            futureBalance
          );


        const result =
          await calculateFutureBalanceAction(
            "family-member-id",

            new Date("2026-08-01"),

            new Date("2026-08-31"),

            1000
          );


        expect(result)
          .toEqual({

            currentBalance: 1000,

            futureIncome: 500,

            futureExpenses: 300,

            futureBalance: 1200,

            isPositive: true,

            isNegative: false

          });


        expect(
          transactionsService
            .calculateFutureBalance
        )
          .toHaveBeenCalledWith(

            "family-member-id",

            expect.any(Object),

            1000

          );

      }
    );

  }
);