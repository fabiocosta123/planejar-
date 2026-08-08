import { accountsService } from "../../services/accounts.service";


export async function findAccountsByFamilyMemberAction(
  familyMemberId: string
) {

  return accountsService.findByFamilyMember(
    familyMemberId
  );

}