import type { TightDayContract } from "@/contracts/financial/tight-day.contract";

interface DashboardTightDayProps {
  data: TightDayContract | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function DashboardTightDay({
  data,
}: DashboardTightDayProps) {
  return (
    <section
      className="mt-4"
      aria-label="Dia do aperto"
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-muted-foreground">
          Dia do aperto
        </p>

        {data ? (
          <>
            <p className="mt-2 text-2xl font-bold tracking-tight">
              {formatDate(data.date)}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Nesse dia o saldo fica em{" "}
              {formatCurrency(data.balance)}, abaixo da reserva de{" "}
              {formatCurrency(data.minimumReserve)}.
            </p>

            <p className="mt-4 text-lg font-semibold">
              Junte {formatCurrency(data.dailyAmount)} por dia
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {data.daysRemaining === 1
                ? "Falta 1 dia para cobrir essa diferença."
                : `Faltam ${data.daysRemaining} dias para cobrir essa diferença.`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Nenhum dia dos próximos 12 meses fica abaixo da reserva.
          </p>
        )}
      </div>
    </section>
  );
}
