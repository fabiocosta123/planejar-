import type { HistoryComparisonContract } from "@/contracts/financial/transaction-history.contract";

interface TransactionComparisonProps {
  comparison: HistoryComparisonContract;
}

function formatCurrency(value: number) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Math.abs(value));

  if (value > 0) {
    return `+${formatted}`;
  }

  if (value < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function TransactionComparison({
  comparison,
}: TransactionComparisonProps) {
  return (
    <section className="mt-6 space-y-3" aria-label="Comparativo">
      <h2 className="text-base font-semibold">Comparativo</h2>

      <ComparisonCard
        title="Mês a mês"
        currentLabel={formatMonth(comparison.currentMonth)}
        previousLabel={formatMonth(comparison.previousMonth)}
        current={comparison.monthCurrent}
        previous={comparison.monthPrevious}
        incomeDifference={comparison.monthIncomeDifference}
        expenseDifference={comparison.monthExpenseDifference}
      />

      <ComparisonCard
        title="Ano a ano"
        currentLabel={String(comparison.currentYear)}
        previousLabel={String(comparison.previousYear)}
        current={comparison.yearCurrent}
        previous={comparison.yearPrevious}
        incomeDifference={comparison.yearIncomeDifference}
        expenseDifference={comparison.yearExpenseDifference}
      />
    </section>
  );
}

function ComparisonCard({
  title,
  currentLabel,
  previousLabel,
  current,
  previous,
  incomeDifference,
  expenseDifference,
}: {
  title: string;
  currentLabel: string;
  previousLabel: string;
  current: { income: number; expenses: number };
  previous: { income: number; expenses: number };
  incomeDifference: number;
  expenseDifference: number;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {currentLabel} em relação a {previousLabel}
      </p>

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt>Entradas</dt>
          <dd className="font-semibold text-emerald-600">
            {formatCurrency(incomeDifference)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Saídas</dt>
          <dd className="font-semibold text-destructive">
            {formatCurrency(expenseDifference)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Entradas de {formatPlain(current.income)} agora e{" "}
        {formatPlain(previous.income)} antes. Saídas de{" "}
        {formatPlain(current.expenses)} agora e{" "}
        {formatPlain(previous.expenses)} antes.
      </p>
    </div>
  );
}

function formatPlain(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
