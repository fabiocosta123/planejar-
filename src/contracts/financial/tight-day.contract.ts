export interface TightDayContract {
  date: Date;
  balance: number;
  minimumReserve: number;
  shortfall: number;
  daysRemaining: number;
  dailyAmount: number;
}
