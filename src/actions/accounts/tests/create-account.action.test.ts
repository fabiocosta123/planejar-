import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { createAccountAction } from "../create-account.action";

import { accountsService } from "../../../services/accounts.service";


vi.mock(
  "../../../services/accounts.service",
  () => ({

    accountsService: {

      create: vi.fn()

    }

  })
);


describe(
  "createAccountAction",
  () => {


    beforeEach(() => {

      vi.clearAllMocks();

    });



    it(
      "deve criar uma conta",
      async () => {


        const data = {

          familyMemberId: "member-1",

          name: "Nubank",

          type: "CHECKING" as const,

          initialBalanceDate:
            new Date("2026-08-08"),

          initialBalance: 1000

        };


        const accountMock = {

          id: "account-1",

          name: "Nubank",

          type: "CHECKING",

          balance: 1000

        };


        vi.mocked(
          accountsService.create
        )
        .mockResolvedValue(
          accountMock
        );



        const result =
          await createAccountAction(
            data
          );



        expect(
          accountsService.create
        )
        .toHaveBeenCalledWith(
          data
        );



        expect(result)
          .toEqual(accountMock);


      }
    );


  }
);