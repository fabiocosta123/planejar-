"use client";

import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

import {
  brazilianToIso,
  isoToBrazilian,
  maskBrazilianDate,
} from "@/lib/date-input";

interface DateInputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 * Campo de data em DD/MM/AAAA. `value` e `onChange` usam AAAA-MM-DD.
 */
export function DateInput({
  id,
  name,
  value,
  onChange,
  required,
  className,
}: DateInputProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState(() => isoToBrazilian(value));
  const [syncedValue, setSyncedValue] = useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);

    if (value !== brazilianToIso(display)) {
      setDisplay(isoToBrazilian(value));
    }
  }

  function handleType(raw: string) {
    const masked = maskBrazilianDate(raw);
    const next = brazilianToIso(masked);

    setDisplay(masked);
    setSyncedValue(next);
    onChange(next);
  }

  function openPicker() {
    const picker = pickerRef.current;

    if (!picker) {
      return;
    }

    try {
      picker.showPicker();
    } catch {
      picker.focus();
      picker.click();
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        value={display}
        onChange={(event) => handleType(event.target.value)}
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD/MM/AAAA"
        maxLength={10}
        required={required}
        className={
          className ??
          "h-11 w-full rounded-md border bg-background pl-3 pr-12 outline-none focus:ring-2 focus:ring-primary"
        }
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label="Abrir calendário"
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground"
      >
        <CalendarDays className="size-5" />
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
        onChange={(event) => {
          setDisplay(isoToBrazilian(event.target.value));
          setSyncedValue(event.target.value);
          onChange(event.target.value);
        }}
        className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0"
      />
    </div>
  );
}
