export interface TransactionSummaryContract {

  id: string;

  description: string;

  amount: number;

  type: "INCOME" | "EXPENSE";

  status: "PENDING" | "COMPLETED" | "CANCELED";

  date: Date;

}