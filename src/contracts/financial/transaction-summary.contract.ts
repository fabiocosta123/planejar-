export interface TransactionSummaryContract {

  id: string;

  description: string;

  amount: number;

  type: "INCOME" | "EXPENSE";

  date: Date;

}