import { accountsService } from "../../services/accounts.service";


export async function getAccountsByFamilyMemberAction(
  familyMemberId: string
) {

  return accountsService.findByFamilyMember(
    familyMemberId
  );

}