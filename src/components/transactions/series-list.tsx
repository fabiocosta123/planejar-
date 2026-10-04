"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import type { SeriesContract } from "@/contracts/financial/series.contract";

import { stopSeriesAction } from "../../actions/transactions/stop-series.action";
import { updateSeriesAction } from "../../actions/transactions/update-series.action";
import { WeekdayPicker } from "./weekday-picker";

interface AccountOption {
  id: string;
  name: string;
}

interface SeriesListProps {
  series: SeriesContract[];
  accounts: AccountOption[];
  canManage: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateInput(value: string) {
  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}

function amountToInput(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SeriesList({
  series,
  accounts,
  canManage,
}: SeriesListProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<SeriesContract | null>(null);
  const [stopping, setStopping] = useState<SeriesContract | null>(null);

  return (
    <section className="mt-6" aria-labelledby="series-title">
      <h2 id="series-title" className="text-base font-semibold">
        Repetições
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        O que se repete todo mês ou todo dia e entra no dia do aperto.
      </p>

      {series.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhuma repetição. Escolha Todo mês ou Todo dia ao registrar um lançamento.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {series.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.type === "INCOME" ? "Entrada" : "Saída"} ·{" "}
                    {item.scheduleLabel}
                    {item.endDate
                      ? ` até ${formatDateInput(item.endDate)}`
                      : ""}{" "}
                    · {item.accountName}
                  </p>
                </div>
                <p
                  className={
                    item.type === "INCOME"
                      ? "font-semibold text-emerald-600"
                      : "font-semibold text-destructive"
                  }
                >
                  {formatCurrency(item.amount)}
                </p>
              </div>

              {canManage ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => setEditing(item)}
                  >
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => setStopping(item)}
                  >
                    Encerrar
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <SeriesEditDialog
          series={editing}
          accounts={accounts}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      ) : null}

      {stopping ? (
        <SeriesStopDialog
          series={stopping}
          onClose={() => setStopping(null)}
          onStopped={() => {
            setStopping(null);
            router.refresh();
          }}
        />
      ) : null}
    </section>
  );
}

function SeriesEditDialog({
  series,
  accounts,
  onClose,
  onSaved,
}: {
  series: SeriesContract;
  accounts: AccountOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [description, setDescription] = useState(series.description);
  const [amount, setAmount] = useState(amountToInput(series.amount));
  const [type, setType] = useState(series.type);
  const [dayOfMonth, setDayOfMonth] = useState(String(series.dayOfMonth));
  const [weekdays, setWeekdays] = useState(series.weekdays);
  const [endDate, setEndDate] = useState(series.endDate ?? "");
  const [accountId, setAccountId] = useState(series.accountId);
  const isDaily = series.frequency === "DAILY";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await updateSeriesAction({
      id: series.id,
      description,
      amount,
      type,
      accountId,
      ...(isDaily
        ? { frequency: "DAILY", weekdays, endDate }
        : { frequency: "MONTHLY", dayOfMonth, endDate }),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-series-title"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="edit-series-title" className="text-lg font-semibold">
          Alterar repetição
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A mudança vale para as próximas repetições. O lançamento já registrado permanece.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "EXPENSE" ? "default" : "outline"}
              className="h-11"
              aria-pressed={type === "EXPENSE"}
              onClick={() => setType("EXPENSE")}
            >
              Saída
            </Button>
            <Button
              type="button"
              variant={type === "INCOME" ? "default" : "outline"}
              className="h-11"
              aria-pressed={type === "INCOME"}
              onClick={() => setType("INCOME")}
            >
              Entrada
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="series-description" className="text-sm font-medium">
              Descrição
            </label>
            <input
              id="series-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={120}
              className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="series-amount" className="text-sm font-medium">
              Valor
            </label>
            <input
              id="series-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isDaily ? (
            <>
              <WeekdayPicker
                idPrefix="series"
                value={weekdays}
                onChange={setWeekdays}
              />

              <div className="space-y-2">
                <label htmlFor="series-end" className="text-sm font-medium">
                  Repetir até
                </label>
                <DateInput
                  id="series-end"
                  value={endDate}
                  onChange={setEndDate}
                  required
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label htmlFor="series-day" className="text-sm font-medium">
                Dia do mês
              </label>
              <input
                id="series-day"
                inputMode="numeric"
                value={dayOfMonth}
                onChange={(event) => setDayOfMonth(event.target.value)}
                required
                className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {isDaily ? null : (
            <div className="space-y-2">
              <label htmlFor="series-end" className="text-sm font-medium">
                Repetir até
              </label>
              <DateInput
                id="series-end"
                value={endDate}
                onChange={setEndDate}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Deixe em branco para repetir sem data para acabar.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="series-account" className="text-sm font-medium">
              Conta
            </label>
            <select
              id="series-account"
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={loading}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="h-11" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SeriesStopDialog({
  series,
  onClose,
  onStopped,
}: {
  series: SeriesContract;
  onClose: () => void;
  onStopped: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStop() {
    setError("");
    setLoading(true);

    const result = await stopSeriesAction(series.id);

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    onStopped();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-series-title"
        className="w-full max-w-lg rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="stop-series-title" className="text-lg font-semibold">
          Encerrar repetição
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {series.description} deixa de entrar nas próximas repetições. O lançamento já registrado permanece.
        </p>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-11"
            disabled={loading}
            onClick={handleStop}
          >
            {loading ? "Encerrando..." : "Encerrar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
