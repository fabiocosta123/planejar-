import { accountsService } from "../../services/accounts.service";

type CreateAccountInput = {
  familyMemberId: string;

  name: string;

  type:
    | "CHECKING"
    | "SAVINGS"
    | "CASH"
    | "INVESTMENT"
    | "OTHER";

  initialBalanceDate: Date;

  initialBalance: number;
};


export async function createAccountAction(
  data: CreateAccountInput
) {

  return accountsService.create(
    data
  );

}