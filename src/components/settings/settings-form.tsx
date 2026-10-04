"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { updateSettingsAction } from "../../actions/settings/update-settings.action";
import { DashboardProOffer } from "../dashboard/dashboard-pro-offer";

const noticeLevels = [
  {
    value: "NONE",
    label: "Nenhum",
    detail: "Você não recebe avisos de movimentação.",
  },
  {
    value: "IMPORTANT",
    label: "Importantes",
    detail: "Você recebe os avisos de entrada e saída.",
  },
  {
    value: "ALL",
    label: "Todos",
    detail: "Você recebe todos os avisos desta conta.",
  },
] as const;

export function SettingsForm({
  minimumReserve,
  dayOfTightnessAlert,
  notificationLevel,
  plan,
  proAmount,
}: {
  minimumReserve: string;
  dayOfTightnessAlert: boolean;
  notificationLevel: "NONE" | "IMPORTANT" | "ALL";
  plan: "FREE" | "PRO";
  proAmount: number;
}) {
  const router = useRouter();
  const [reserve, setReserve] = useState(minimumReserve);
  const [showTightDay, setShowTightDay] = useState(dayOfTightnessAlert);
  const [level, setLevel] = useState(notificationLevel);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    const result = await updateSettingsAction({
      minimumReserve: reserve,
      dayOfTightnessAlert: showTightDay,
      notificationLevel: level,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      <section className="rounded-3xl border bg-card p-4 shadow-sm" aria-label="Reserva">
        <h2 className="font-medium">Reserva mínima</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {plan === "PRO"
            ? "O dia do aperto usa este valor sobre o saldo da família."
            : "Na versão Pro, o painel usa este valor para achar o dia do aperto."}
        </p>
        <label htmlFor="minimum-reserve" className="mt-4 block text-sm font-medium">
          Valor
        </label>
        <input
          id="minimum-reserve"
          inputMode="decimal"
          value={reserve}
          onChange={(event) => setReserve(event.target.value)}
          required
          className="mt-2 h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-4 flex items-start gap-3">
          <input
            id="show-tight-day"
            type="checkbox"
            checked={showTightDay}
            onChange={(event) => setShowTightDay(event.target.checked)}
            className="mt-1 size-5"
          />
          <label htmlFor="show-tight-day" className="text-sm font-medium">
            Mostrar o dia do aperto no painel
          </label>
        </div>
      </section>

      <fieldset className="rounded-3xl border bg-card p-4 shadow-sm">
        <legend className="font-medium">Avisos</legend>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Com nenhum, você deixa de receber avisos de movimentação.
        </p>
        <div className="mt-4 space-y-2">
          {noticeLevels.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3"
            >
              <input
                type="radio"
                name="notification-level"
                value={option.value}
                checked={level === option.value}
                onChange={() => setLevel(option.value)}
                className="mt-1 size-5"
              />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {option.detail}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="rounded-3xl border bg-card p-4 shadow-sm" aria-label="Plano">
        <h2 className="font-medium">Plano</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {plan === "PRO" ? "Sua conta está na versão Pro." : "Sua conta está na versão grátis."}
        </p>
        {plan === "FREE" ? <DashboardProOffer amount={proAmount} variant="button" /> : null}
      </section>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="text-sm text-primary" role="status">
          Configurações salvas.
        </p>
      ) : null}

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={() => void signOut({ callbackUrl: "/login" })}
      >
        Sair
      </Button>
    </form>
  );
}
