import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { familyMemberService } from "../../../services/family-member.service";
import { accountsService } from "../../../services/accounts.service";

import {
  getCurrentUserAccountsAction
} from "../get-current-user-accounts.action";


vi.mock(
  "../../../services/family-member.service",
  () => ({
    familyMemberService: {
      findByFamilyAndUser: vi.fn()
    }
  })
);


vi.mock(
  "../../../services/accounts.service",
  () => ({
    accountsService: {
      findByFamilyMember: vi.fn()
    }
  })
);


describe(
  "getCurrentUserAccountsAction",
  () => {

    beforeEach(() => {
      vi.clearAllMocks();
    });


    it(
      "deve buscar as contas do usuário na família informada",
      async () => {

        vi.mocked(
          familyMemberService.findByFamilyAndUser
        ).mockResolvedValue({
          id: "member-1",
          familyId: "family-1",
          userId: "user-1",
          role: "OWNER",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        });


        vi.mocked(
          accountsService.findByFamilyMember
        ).mockResolvedValue([
          {
            id: "account-1",
            name: "Conta Principal",
            type: "CHECKING",
            balance: 1000
          }
        ]);


        const result =
          await getCurrentUserAccountsAction(
            "user-1",
            "family-1"
          );


        expect(result)
          .toHaveLength(1);


        expect(result[0].id)
          .toBe("account-1");


        expect(
          familyMemberService.findByFamilyAndUser
        )
          .toHaveBeenCalledWith(
            "family-1",
            "user-1"
          );


        expect(
          accountsService.findByFamilyMember
        )
          .toHaveBeenCalledWith(
            "member-1"
          );

      }
    );


    it(
      "deve retornar vazio quando o usuário não pertence à família",
      async () => {

        vi.mocked(
          familyMemberService.findByFamilyAndUser
        ).mockResolvedValue(null);


        const result =
          await getCurrentUserAccountsAction(
            "user-1",
            "family-2"
          );


        expect(result)
          .toEqual([]);


        expect(
          accountsService.findByFamilyMember
        )
          .not
          .toHaveBeenCalled();

      }
    );

  }
);