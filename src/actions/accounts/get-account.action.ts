import { accountsService } from "../../services/accounts.service";


export async function getAccountAction(
  id: string
) {

  return accountsService.findById(
    id
  );

}