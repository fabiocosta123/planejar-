import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import { familyMemberService } from "../../../services/family-member.service";

import {
  getCurrentFamilyMemberAction
} from "../get-current-family-member.action";


vi.mock(
  "../../../services/family-member.service",
  () => ({
    familyMemberService: {
      findByFamilyAndUser: vi.fn()
    }
  })
);


describe(
  "getCurrentFamilyMemberAction",
  () => {

    beforeEach(() => {
      vi.clearAllMocks();
    });


    it(
      "deve retornar o membro do usuário na família informada",
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


        const result =
          await getCurrentFamilyMemberAction(
            "user-1",
            "family-1"
          );


        expect(result?.id)
          .toBe("member-1");


        expect(
          familyMemberService.findByFamilyAndUser
        )
          .toHaveBeenCalledWith(
            "family-1",
            "user-1"
          );

      }
    );


    it(
      "deve retornar null quando o usuário não pertence à família",
      async () => {

        vi.mocked(
          familyMemberService.findByFamilyAndUser
        ).mockResolvedValue(null);


        const result =
          await getCurrentFamilyMemberAction(
            "user-1",
            "family-2"
          );


        expect(result)
          .toBeNull();


        expect(
          familyMemberService.findByFamilyAndUser
        )
          .toHaveBeenCalledWith(
            "family-2",
            "user-1"
          );

      }
    );

  }
);