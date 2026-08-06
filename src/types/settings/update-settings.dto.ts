import {
  Currency,
  NotificationLevel,
  Theme,
  WeekStartDay,
} from "../../lib/generated/prisma/enums";

export interface UpdateSettingsDto {
  currency?: Currency;

  locale?: string;

  theme?: Theme;

  weekStartsOn?: WeekStartDay;

  notificationLevel?: NotificationLevel;

  dayOfTightnessAlert?: boolean;

  minimumReserve?: number;
}