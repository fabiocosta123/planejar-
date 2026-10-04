export interface TransactionInput {
  amount: number;
  type: "INCOME" | "EXPENSE";

  transactionDate: Date;

  status: "PENDING" | "COMPLETED" | "CANCELED";
}