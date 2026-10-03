import { TransactionInput } from "../models/transaction-input";

export const RECURRENCE_HORIZON_MONTHS = 12;

export interface MonthlyRecurrenceSource {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  startDate: Date;
  endDate: Date | null;
}

export interface OccupiedOccurrence {
  description: string;
  type: "INCOME" | "EXPENSE";
  transactionDate: Date;
}

export function recurrenceHorizonEnd(referenceDate: Date): Date {
  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + RECURRENCE_HORIZON_MONTHS,
    referenceDate.getDate(),
    23,
    59,
    59,
    999
  );
}

export function projectMonthlyOccurrences(
  rules: MonthlyRecurrenceSource[],
  referenceDate: Date,
  horizonEnd: Date,
  occupied: OccupiedOccurrence[] = []
): TransactionInput[] {
  const taken = new Set(occupied.map(occurrenceKey));
  const projected: TransactionInput[] = [];

  for (const rule of rules) {
    const dayOfMonth = rule.startDate.getDate();

    for (let offset = 1; offset <= RECURRENCE_HORIZON_MONTHS + 1; offset++) {
      const date = occurrenceDate(rule.startDate, offset, dayOfMonth);

      if (date.getTime() > horizonEnd.getTime()) {
        break;
      }

      if (rule.endDate && startOfDay(date) > startOfDay(rule.endDate)) {
        break;
      }

      if (!isAfterDay(date, referenceDate)) {
        continue;
      }

      const key = occurrenceKey({
        description: rule.description,
        type: rule.type,
        transactionDate: date,
      });

      if (taken.has(key)) {
        continue;
      }

      taken.add(key);
      projected.push({
        amount: rule.amount,
        type: rule.type,
        status: "PENDING",
        transactionDate: date,
      });
    }
  }

  return projected;
}

function occurrenceDate(
  start: Date,
  monthOffset: number,
  dayOfMonth: number
): Date {
  const monthIndex = start.getMonth() + monthOffset;
  const year = start.getFullYear() + Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const lastDay = new Date(year, month + 1, 0).getDate();

  return new Date(year, month, Math.min(dayOfMonth, lastDay));
}

function occurrenceKey(occurrence: OccupiedOccurrence): string {
  const day = startOfDay(occurrence.transactionDate);

  return [
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    occurrence.type,
    occurrence.description.trim(),
  ].join("|");
}

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function isAfterDay(date: Date, referenceDate: Date): boolean {
  return startOfDay(date).getTime() > startOfDay(referenceDate).getTime();
}
