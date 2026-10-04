import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { getAccountAction } from "../get-account.action";

import { accountsService } from "../../../services/accounts.service";


vi.mock(
  "../../../services/accounts.service",
  () => ({

    accountsService: {

      findById: vi.fn()

    }

  })
);


describe(
  "getAccountAction",
  () => {


    beforeEach(() => {

      vi.clearAllMocks();

    });



    it(
      "deve buscar uma conta por id",
      async () => {


        const accountMock = {

          id: "account-1",

          name: "Nubank",

          type: "CHECKING",

          balance: 1000

        };


        vi.mocked(
          accountsService.findById
        )
        .mockResolvedValue(
          accountMock
        );



        const result =
          await getAccountAction(
            "account-1"
          );



        expect(
          accountsService.findById
        )
        .toHaveBeenCalledWith(
          "account-1"
        );



        expect(result)
          .toEqual(accountMock);
      }
    );
  }
);