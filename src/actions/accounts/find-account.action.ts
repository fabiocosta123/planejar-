import { accountsService } from "../../services/accounts.service";


export async function findAccountAction(
  accountId: string
) {

  return accountsService.findById(
    accountId
  );

}