import { familyMemberService } from "../../services/family-member.service";
import { accountsService } from "../../services/accounts.service";

export async function getCurrentUserAccountsAction(
  userId: string,
  familyId: string
) {

  const familyMember =
    await familyMemberService.findByFamilyAndUser(
      familyId,
      userId
    );

  if (!familyMember) {
    return [];
  }

  return accountsService.findByFamilyMember(
    familyMember.id
  );
}