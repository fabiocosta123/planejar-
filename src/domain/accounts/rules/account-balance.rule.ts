import { Account } from "../models/account";
import { TransactionInput } from "../../financial/models/transaction-input";


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


  calculateAfterTransactionInput(
    currentBalance: number,
    transaction: TransactionInput
  ): number {

    const type =
      transaction.type === "INCOME"
        ? "CREDIT"
        : "DEBIT";


    return this.calculateAfterTransaction(
      currentBalance,
      transaction.amount,
      type
    );

  }


  hasNegativeBalance(
    account: Account
  ): boolean {

    return (
      account.currentBalance < 0
    );

  }

}