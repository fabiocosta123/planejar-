import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
} from "vitest";

import {
  getTransactionsAction,
} from "../get-transactions.action";

import {
  transactionsService,
} from "../../../services/transactions.service";

describe(
  "getTransactionsAction",
  () => {

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it(
      "deve retornar os lançamentos do período",
      async () => {

        const transactions = [
          {
            id: "transaction-1",
            description: "Mercado",
            amount: 150,
            type: "EXPENSE" as const,
            status: "COMPLETED" as const,
            date: new Date("2026-08-20"),
          },

          {
            id: "transaction-2",
            description: "Salário",
            amount: 5000,
            type: "INCOME" as const,
            status: "COMPLETED" as const,
            date: new Date("2026-08-05"),
          },
        ];

        const spy =
          vi.spyOn(
            transactionsService,
            "findSummaryByPeriod"
          )
          .mockResolvedValue(
            transactions
          );

        const result =
          await getTransactionsAction(
            "family-member-id",
            new Date("2026-08-01"),
            new Date("2026-08-31")
          );

        expect(spy)
          .toHaveBeenCalledWith(
            "family-member-id",
            expect.any(Object)
          );

        expect(result)
          .toEqual(transactions);

      }
    );

  }
);