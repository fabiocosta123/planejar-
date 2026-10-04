import { TransactionInput } from "../models/transaction-input";

export const RECURRENCE_HORIZON_MONTHS = 12;

export type RecurrenceFrequency = "MONTHLY" | "DAILY";

export interface RecurrenceSource {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  startDate: Date;
  endDate: Date | null;
  frequency?: RecurrenceFrequency;
  dayOfMonth?: number;
  weekdays?: number[];
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

export const DAILY_MAX_MONTHS = 12;

export type DailyEndProblem = "NOT_AFTER_START" | "TOO_FAR";

export function defaultDailyEnd(startDate: Date): Date {
  const endOfYear = new Date(startDate.getFullYear(), 11, 31);

  if (startOfDay(startDate).getTime() < endOfYear.getTime()) {
    return endOfYear;
  }

  return new Date(startDate.getFullYear() + 1, 11, 31);
}

export function dailyEndProblem(
  startDate: Date,
  endDate: Date
): DailyEndProblem | null {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);

  if (end.getTime() <= start.getTime()) {
    return "NOT_AFTER_START";
  }

  const limit = new Date(
    start.getFullYear(),
    start.getMonth() + DAILY_MAX_MONTHS,
    start.getDate()
  );

  if (end.getTime() > limit.getTime()) {
    return "TOO_FAR";
  }

  return null;
}

export function projectRecurringOccurrences(
  rules: RecurrenceSource[],
  referenceDate: Date,
  horizonEnd: Date,
  occupied: OccupiedOccurrence[] = []
): TransactionInput[] {
  const taken = new Set(occupied.map(occurrenceKey));
  const projected: TransactionInput[] = [];

  for (const rule of rules) {
    for (const date of occurrenceDates(rule, horizonEnd)) {
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

function* occurrenceDates(
  rule: RecurrenceSource,
  horizonEnd: Date
): Generator<Date> {
  if (rule.frequency === "DAILY") {
    const weekdays = new Set(rule.weekdays ?? []);

    if (weekdays.size === 0) {
      return;
    }

    const start = startOfDay(rule.startDate);

    for (let offset = 1; ; offset++) {
      const date = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + offset
      );

      if (date.getTime() > horizonEnd.getTime()) {
        return;
      }

      if (weekdays.has(date.getDay())) {
        yield date;
      }
    }
  }

  const dayOfMonth = rule.dayOfMonth ?? rule.startDate.getDate();

  for (let offset = 1; offset <= RECURRENCE_HORIZON_MONTHS + 1; offset++) {
    const date = monthlyDate(rule.startDate, offset, dayOfMonth);

    if (date.getTime() > horizonEnd.getTime()) {
      return;
    }

    yield date;
  }
}

function monthlyDate(
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
