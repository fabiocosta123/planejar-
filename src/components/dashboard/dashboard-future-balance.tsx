import {
  ArrowDown,
  ArrowUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FutureBalanceContract } from "@/contracts/financial/future-balance.contract";

interface DashboardFutureBalanceProps {
  futureBalance: FutureBalanceContract;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DashboardFutureBalance({
  futureBalance,
}: DashboardFutureBalanceProps) {
  const isNegative = futureBalance.isNegative;

  return (
    <section
      className="mt-4"
      aria-label="Saldo futuro"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Saldo futuro
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            className={[
              "rounded-xl border p-4",
              isNegative
                ? "border-destructive/30 bg-destructive/5"
                : "border-emerald-500/30 bg-emerald-500/5",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Projeção
                </p>

                <p
                  className={[
                    "mt-1 text-2xl font-bold tracking-tight",
                    isNegative
                      ? "text-destructive"
                      : "text-emerald-600",
                  ].join(" ")}
                >
                  {formatCurrency(
                    futureBalance.futureBalance
                  )}
                </p>
              </div>

              <div
                className={[
                  "flex size-10 items-center justify-center rounded-full",
                  isNegative
                    ? "bg-destructive/10"
                    : "bg-emerald-500/10",
                ].join(" ")}
              >
                {isNegative ? (
                  <TrendingDown className="size-5 text-destructive" />
                ) : (
                  <TrendingUp className="size-5 text-emerald-600" />
                )}
              </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {isNegative
                ? "A projeção indica saldo negativo."
                : "A projeção indica saldo positivo."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                Atual
              </p>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(
                  futureBalance.currentBalance
                )}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/5 p-3">
              <div className="flex items-center gap-1">
                <ArrowUp className="size-3.5 text-emerald-600" />

                <p className="text-xs text-muted-foreground">
                  Entradas
                </p>
              </div>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(
                  futureBalance.futureIncome
                )}
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 p-3">
              <div className="flex items-center gap-1">
                <ArrowDown className="size-3.5 text-destructive" />

                <p className="text-xs text-muted-foreground">
                  Saídas
                </p>
              </div>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(
                  futureBalance.futureExpenses
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}