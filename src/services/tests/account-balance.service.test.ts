import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { accountsRepository } from "../../repositories/accounts.repository";
import { transactionsRepository } from "../../repositories/transactions.repository";

import {
  AccountBalanceService
} from "../account-balance.service";

import { financialEngine } from "../../domain/financial/engine/financial-engine";

vi.mock(
  "../../domain/financial/engine/financial-engine",
  () => ({
    financialEngine: {
      calculateCurrentBalance: vi.fn()
    }
  })
);

vi.mock(
  "../../repositories/accounts.repository",
  () => ({
    accountsRepository: {
      findByFamilyMember: vi.fn()
    }
  })
);


vi.mock(
  "../../repositories/transactions.repository",
  () => ({
    transactionsRepository: {
      findByAccountId: vi.fn()
    }
  })
);



describe(
  "AccountBalanceService",
  () => {

    let service: AccountBalanceService;


    beforeEach(() => {

      vi.clearAllMocks();

      service =
        new AccountBalanceService();

    });


    it(
      "deve calcular o saldo consolidado das contas do membro",
      async () => {

        const referenceDate =
          new Date("2026-08-10");


        vi.mocked(
          accountsRepository.findByFamilyMember
        ).mockResolvedValue([
          {
            id: "account-1",
            name: "Conta Principal",
            type: "CHECKING",
            initialBalanceDate:
              new Date("2026-08-01"),
            initialBalance: 1000
          },

          {
            id: "account-2",
            name: "Poupança",
            type: "SAVINGS",
            initialBalanceDate:
              new Date("2026-08-01"),
            initialBalance: 500
          }
        ]);


        vi.mocked(
          transactionsRepository.findByAccountId
        )
          .mockResolvedValueOnce([
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
                new Date("2026-08-07"),
              status: "COMPLETED"
            }
          ])

          .mockResolvedValueOnce([
            {
              amount: 100,
              type: "EXPENSE",
              transactionDate:
                new Date("2026-08-08"),
              status: "COMPLETED"
            }
          ]);

        vi.mocked(
          financialEngine.calculateCurrentBalance
        )
          .mockReturnValueOnce(1300)
          .mockReturnValueOnce(400);

        const result =
          await service.calculateCurrentBalance(
            "member-1",
            referenceDate
          );


        expect(result)
          .toBe(1700);


        expect(
          accountsRepository.findByFamilyMember
        )
          .toHaveBeenCalledWith(
            "member-1"
          );


        expect(
          transactionsRepository.findByAccountId
        )
          .toHaveBeenCalledTimes(2);


        expect(
          transactionsRepository.findByAccountId
        )
          .toHaveBeenNthCalledWith(
            1,
            "account-1"
          );


        expect(
          transactionsRepository.findByAccountId
        )
          .toHaveBeenNthCalledWith(
            2,
            "account-2"
          );

          expect(
  financialEngine.calculateCurrentBalance
)
  .toHaveBeenCalledTimes(2);

  expect(
  financialEngine.calculateCurrentBalance
)
  .toHaveBeenNthCalledWith(
    1,
    1000,
    expect.any(Array),
    referenceDate
  );

  expect(
  financialEngine.calculateCurrentBalance
)
  .toHaveBeenNthCalledWith(
    2,
    500,
    expect.any(Array),
    referenceDate
  );

      }
    );


    it(
      "deve retornar zero quando o membro não possui contas",
      async () => {

        vi.mocked(
          accountsRepository.findByFamilyMember
        )
          .mockResolvedValue([]);


        const result =
          await service.calculateCurrentBalance(
            "member-1",
            new Date("2026-08-10")
          );


        expect(result)
          .toBe(0);


        expect(
          transactionsRepository.findByAccountId
        )
          .not
          .toHaveBeenCalled();

      }
    );

  }
);
