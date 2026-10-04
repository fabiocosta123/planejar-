export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
export const MONDAY_TO_FRIDAY = [1, 2, 3, 4, 5] as const;
export const MONDAY_TO_SATURDAY = [1, 2, 3, 4, 5, 6] as const;

const SHORT_NAMES = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function normalizeWeekdays(weekdays: readonly number[]): number[] {
  return [...new Set(weekdays)].sort((a, b) => a - b);
}

export function isValidWeekday(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 6;
}

export function weekdaysLabel(weekdays: readonly number[]): string {
  const days = normalizeWeekdays(weekdays);

  if (sameDays(days, ALL_WEEKDAYS)) {
    return "todos os dias";
  }

  if (sameDays(days, MONDAY_TO_FRIDAY)) {
    return "segunda a sexta";
  }

  if (sameDays(days, MONDAY_TO_SATURDAY)) {
    return "segunda a sábado";
  }

  return [...days]
    .sort((a, b) => mondayFirst(a) - mondayFirst(b))
    .map((day) => SHORT_NAMES[day])
    .join(", ");
}

function mondayFirst(day: number) {
  return day === 0 ? 7 : day;
}

export function weekdayShortName(day: number): string {
  return SHORT_NAMES[day] ?? "";
}

function sameDays(days: readonly number[], expected: readonly number[]) {
  return (
    days.length === expected.length &&
    days.every((day, index) => day === expected[index])
  );
}
