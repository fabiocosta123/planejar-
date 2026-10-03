import type { TransactionSummaryContract } from "../../contracts/financial/transaction-summary.contract";

export class TransactionSummaryMapper {

  static toContract(
    transaction: any
  ): TransactionSummaryContract {

    return {
      id: transaction.id,

      description:
        transaction.description,

      amount:
        Number(transaction.amount),

      type:
        transaction.type,

      status:
        transaction.status,

      date:
        transaction.transactionDate,
    };

  }

}