import { ArrowDown, ArrowUp, WalletCards } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const {
    currentBalance,
    futureIncome,
    futureExpenses,
    futureBalance: projectedBalance,
    isPositive,
  } = futureBalance;

  return (
    <section
      className="mt-4"
      aria-label="Saldo futuro"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WalletCards className="size-5" />
            </div>

            <div>
              <CardTitle className="text-base">
                Saldo futuro
              </CardTitle>

              <p className="text-xs text-muted-foreground">
                Projeção financeira
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">
              Saldo projetado
            </p>

            <p
              className={[
                "mt-1 text-2xl font-bold tracking-tight",
                isPositive
                  ? "text-foreground"
                  : "text-destructive",
              ].join(" ")}
            >
              {formatCurrency(projectedBalance)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border bg-card p-3">
              <p className="text-[11px] text-muted-foreground">
                Atual
              </p>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(currentBalance)}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowUp className="size-3.5" />

                <span className="text-[11px]">
                  Entradas
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(futureIncome)}
              </p>
            </div>

            <div className="rounded-xl border bg-card p-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowDown className="size-3.5" />

                <span className="text-[11px]">
                  Saídas
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(futureExpenses)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}