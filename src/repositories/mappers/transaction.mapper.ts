import { TransactionInput } from "../../domain/financial/models/transaction-input";


export class TransactionMapper {

  static toDomain(
    transaction: any
  ): TransactionInput {

    return {

      type: transaction.type,

      amount:
        Number(transaction.amount),

      transactionDate:
        transaction.transactionDate

    };

  }

}