import {
  ArrowDown,
  ArrowUp,
  Wallet,
  AlertTriangle,
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
  const currentBalance = summary.currentBalance;
  const balanceIsNegative = currentBalance < 0;

  return (
    <section
      className="mt-6 space-y-3"
      aria-label="Resumo financeiro"
    >
      {/* Saldo principal */}
      <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Saldo disponível
              </p>

              <p
                className={[
                  "mt-2 text-3xl font-bold tracking-tight",
                  balanceIsNegative
                    ? "text-destructive"
                    : "text-foreground",
                ].join(" ")}
              >
                {formatCurrency(currentBalance)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Saldo calculado até hoje
              </p>
            </div>

            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-full",
                balanceIsNegative
                  ? "bg-destructive/10"
                  : "bg-primary/10",
              ].join(" ")}
            >
              <Wallet
                className={[
                  "size-5",
                  balanceIsNegative
                    ? "text-destructive"
                    : "text-primary",
                ].join(" ")}
              />
            </div>
          </div>

          {summary.limitExceeded && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5">
              <AlertTriangle className="size-4 shrink-0 text-destructive" />

              <p className="text-xs font-medium text-destructive">
                O limite de gastos do período foi excedido.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entradas e saídas */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryItem
          label="Entradas"
          value={summary.income}
          type="income"
        />

        <SummaryItem
          label="Saídas"
          value={summary.expenses}
          type="expense"
        />
      </div>
    </section>
  );
}

interface SummaryItemProps {
  label: string;
  value: number;
  type: "income" | "expense";
}

function SummaryItem({
  label,
  value,
  type,
}: SummaryItemProps) {
  const isIncome = type === "income";

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div
            className={[
              "flex size-8 items-center justify-center rounded-full",
              isIncome
                ? "bg-emerald-500/10"
                : "bg-destructive/10",
            ].join(" ")}
          >
            {isIncome ? (
              <ArrowUp className="size-4 text-emerald-600" />
            ) : (
              <ArrowDown className="size-4 text-destructive" />
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>

        <p
          className={[
            "mt-3 text-lg font-semibold tracking-tight",
            isIncome
              ? "text-emerald-600"
              : "text-destructive",
          ].join(" ")}
        >
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}