import { MoneyValue } from "../../types/money";


export interface AccountPersistence {

  id:string;

  name:string;

  type:
    | "CHECKING"
    | "SAVINGS"
    | "CASH"
    | "INVESTMENT"
    | "OTHER";

  initialBalanceDate: Date
  initialBalance: MoneyValue;

}