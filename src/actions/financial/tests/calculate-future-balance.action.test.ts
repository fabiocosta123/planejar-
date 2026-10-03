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

import { accountBalanceService } from "../../../services/account-balance.service";

vi.mock(
  "../../../services/account-balance.service",
  () => ({
    accountBalanceService: {
      calculateCurrentBalance: vi.fn()
    }
  })
);

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

        vi.mocked(
          accountBalanceService.calculateCurrentBalance
        )
          .mockResolvedValue(1000);

        const result =
          await calculateFutureBalanceAction(
            "family-member-id",
            new Date("2026-08-01"),
            new Date("2026-08-31"),
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

        expect(
          accountBalanceService.calculateCurrentBalance
        )
          .toHaveBeenCalledWith(
            "family-member-id"
          );

      }
    );

  }
);