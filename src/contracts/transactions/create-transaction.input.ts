export interface CreateTransactionInput {
  familyMemberId: string;

  accountId: string;

  description: string;

  notes?: string;

  amount: number;

  type: "INCOME" | "EXPENSE";

  status: "PENDING" | "COMPLETED" | "CANCELED";

  transactionDate: Date;
}