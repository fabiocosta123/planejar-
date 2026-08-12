import {
  ArrowDown,
  ArrowUp,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { FinancialSummaryContract } from "@/contracts/financial/financial-summary.contract";

interface DashboardSummaryProps {
  summary: FinancialSummaryContract;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DashboardSummary({
  summary,
}: DashboardSummaryProps) {
  return (
    <section
      className="mt-6 space-y-4"
      aria-label="Resumo financeiro"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Saldo atual
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {formatCurrency(summary.balance)}
              </p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="size-5 text-primary" />
            </div>
          </div>

          {summary.limitExceeded && (
            <p className="mt-3 text-sm font-medium text-destructive">
              Limite de gastos excedido.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowUp className="size-4 text-emerald-600" />
              </div>

              <p className="text-sm text-muted-foreground">
                Entradas
              </p>
            </div>

            <p className="mt-3 text-lg font-semibold">
              {formatCurrency(summary.income)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10">
                <ArrowDown className="size-4 text-destructive" />
              </div>

              <p className="text-sm text-muted-foreground">
                Saídas
              </p>
            </div>

            <p className="mt-3 text-lg font-semibold">
              {formatCurrency(summary.expenses)}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}