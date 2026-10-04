import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { getAccountsByFamilyMemberAction } from "../get-accounts-by-family-member.action";

import { accountsService } from "../../../services/accounts.service";


vi.mock(
  "../../../services/accounts.service",
  () => ({

    accountsService: {

      findByFamilyMember: vi.fn()

    }

  })
);


describe(
  "getAccountsByFamilyMemberAction",
  () => {


    beforeEach(() => {

      vi.clearAllMocks();

    });



    it(
      "deve buscar contas do membro da família",
      async () => {


        const accountsMock = [

          {

            id: "account-1",

            name: "Nubank",

            type: "CHECKING",

            balance: 1000

          },

          {

            id: "account-2",

            name: "Carteira",

            type: "CASH",

            balance: 250

          }

        ];


        vi.mocked(
          accountsService.findByFamilyMember
        )
        .mockResolvedValue(
          accountsMock
        );



        const result =
          await getAccountsByFamilyMemberAction(
            "member-1"
          );



        expect(
          accountsService.findByFamilyMember
        )
        .toHaveBeenCalledWith(
          "member-1"
        );



        expect(result)
          .toEqual(accountsMock);


      }
    );


  }
);