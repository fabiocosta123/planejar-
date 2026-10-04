export interface SeriesContract {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  frequency: "MONTHLY" | "DAILY";
  dayOfMonth: number;
  weekdays: number[];
  scheduleLabel: string;
  startDate: string;
  endDate: string | null;
  accountId: string;
  accountName: string;
}
