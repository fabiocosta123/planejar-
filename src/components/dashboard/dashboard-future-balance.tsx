import type { FutureBalanceContract } from "@/contracts/financial/future-balance.contract";

interface DashboardFutureBalanceProps {
  data: FutureBalanceContract;
}

export function DashboardFutureBalance({
  data,
}: DashboardFutureBalanceProps) {

  const {
    currentBalance,
    futureIncome,
    futureExpenses,
    futureBalance,
    isPositive,
    isNegative,
  } = data;

  return (
    <section
      className="mt-4"
      aria-label="Saldo futuro"
    >
      <div className="rounded-2xl border bg-card p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-muted-foreground">
              Saldo futuro
            </p>

            <p
              className={[
                "mt-2 text-3xl font-bold tracking-tight",
                isPositive && "text-emerald-600",
                isNegative && "text-red-600",
                !isPositive &&
                  !isNegative &&
                  "text-foreground",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {formatCurrency(futureBalance)}
            </p>

          </div>

          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full",
              isPositive && "bg-emerald-100",
              isNegative && "bg-red-100",
              !isPositive &&
                !isNegative &&
                "bg-muted",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="text-lg">
              {isPositive
                ? "↗"
                : isNegative
                  ? "↘"
                  : "→"}
            </span>
          </div>

        </div>


        <div className="mt-5 grid grid-cols-3 gap-3">

          <BalanceItem
            label="Saldo atual"
            value={currentBalance}
          />

          <BalanceItem
            label="Entradas"
            value={futureIncome}
            positive
          />

          <BalanceItem
            label="Despesas"
            value={futureExpenses}
            negative
          />

        </div>

      </div>
    </section>
  );
}


interface BalanceItemProps {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
}


function BalanceItem({
  label,
  value,
  positive,
  negative,
}: BalanceItemProps) {

  return (
    <div className="rounded-xl bg-muted/50 p-3">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-sm font-semibold",
          positive && "text-emerald-600",
          negative && "text-red-600",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formatCurrency(value)}
      </p>

    </div>
  );
}


function formatCurrency(
  value: number
) {

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(value);

}