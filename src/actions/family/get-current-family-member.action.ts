import { familyMemberService } from "../../services/family-member.service";

export async function getCurrentFamilyMemberAction(
  userId: string,
  familyId: string
) {

  return familyMemberService.findByFamilyAndUser(
    familyId,
    userId
  );
}