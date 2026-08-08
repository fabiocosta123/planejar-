import { Account } from "../models/account";


export class AccountBalanceRule {


  canDebit(
    account: Account,
    amount: number
  ): boolean {

    return (
      account.currentBalance >= amount
    );

  }


  calculateAfterTransaction(
    currentBalance: number,
    amount: number,
    type: "CREDIT" | "DEBIT"
  ): number {


    if (type === "CREDIT") {
      return currentBalance + amount;
    }


    return currentBalance - amount;

  }


  hasNegativeBalance(
    account: Account
  ): boolean {

    return (
      account.currentBalance < 0
    );

  }

}