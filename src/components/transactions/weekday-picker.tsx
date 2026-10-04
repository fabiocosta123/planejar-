"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ALL_WEEKDAYS,
  MONDAY_TO_FRIDAY,
  MONDAY_TO_SATURDAY,
  normalizeWeekdays,
  weekdayShortName,
} from "@/domain/financial/rules/weekdays";

const PRESETS = [
  { id: "all", label: "Segunda a domingo", days: ALL_WEEKDAYS },
  { id: "weekdays", label: "Segunda a sexta", days: MONDAY_TO_FRIDAY },
  { id: "saturday", label: "Segunda a sábado", days: MONDAY_TO_SATURDAY },
] as const;

const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

type PresetId = (typeof PRESETS)[number]["id"] | "custom";

function presetFor(weekdays: number[]): PresetId {
  const days = normalizeWeekdays(weekdays).join(",");
  const preset = PRESETS.find((item) => item.days.join(",") === days);

  return preset?.id ?? "custom";
}

interface WeekdayPickerProps {
  idPrefix: string;
  value: number[];
  onChange: (weekdays: number[]) => void;
}

export function WeekdayPicker({ idPrefix, value, onChange }: WeekdayPickerProps) {
  const [preset, setPreset] = useState<PresetId>(() => presetFor(value));

  function choosePreset(id: PresetId) {
    setPreset(id);

    const match = PRESETS.find((item) => item.id === id);

    if (match) {
      onChange([...match.days]);
    }
  }

  function toggleDay(day: number) {
    onChange(
      value.includes(day)
        ? value.filter((item) => item !== day)
        : normalizeWeekdays([...value, day])
    );
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Em quais dias?</legend>

      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={preset === item.id ? "default" : "outline"}
            className="h-11"
            aria-pressed={preset === item.id}
            onClick={() => choosePreset(item.id)}
          >
            {item.label}
          </Button>
        ))}
        <Button
          type="button"
          variant={preset === "custom" ? "default" : "outline"}
          className="h-11"
          aria-pressed={preset === "custom"}
          onClick={() => choosePreset("custom")}
        >
          Escolher os dias
        </Button>
      </div>

      {preset === "custom" ? (
        <div className="grid grid-cols-7 gap-1" id={`${idPrefix}-days`}>
          {DISPLAY_ORDER.map((day) => (
            <Button
              key={day}
              type="button"
              variant={value.includes(day) ? "default" : "outline"}
              className="h-11 px-0 text-xs capitalize"
              aria-pressed={value.includes(day)}
              onClick={() => toggleDay(day)}
            >
              {weekdayShortName(day)}
            </Button>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
