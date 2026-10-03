export interface SeriesContract {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  dayOfMonth: number;
  accountId: string;
  accountName: string;
}
