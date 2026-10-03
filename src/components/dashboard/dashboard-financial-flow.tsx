import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FinancialFlowContract } from "@/contracts/financial/financial-flow.contract";

interface DashboardFinancialFlowProps {
  financialFlow: FinancialFlowContract[];
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
    month: "short",
  })
    .format(new Date(date))
    .replace(".", "");
}

export function DashboardFinancialFlow({
  financialFlow,
}: DashboardFinancialFlowProps) {
  const latestEntry =
    financialFlow.length > 0
      ? financialFlow[financialFlow.length - 1]
      : null;

  const balanceIsNegative =
    latestEntry?.isNegative ?? false;

  return (
    <section
      className="mt-4"
      aria-label="Fluxo financeiro"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>

              <div>
                <CardTitle className="text-base">
                  Fluxo financeiro
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  Evolução do saldo no período
                </p>
              </div>
            </div>

            {latestEntry && (
              <div
                className={[
                  "flex items-center gap-1 text-xs font-medium",
                  balanceIsNegative
                    ? "text-destructive"
                    : "text-emerald-600",
                ].join(" ")}
              >
                {balanceIsNegative ? (
                  <TrendingDown className="size-3.5" />
                ) : (
                  <TrendingUp className="size-3.5" />
                )}

                <span>
                  {balanceIsNegative
                    ? "Saldo negativo"
                    : "Saldo positivo"}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {financialFlow.length === 0 ? (
            <EmptyFinancialFlow />
          ) : (
            <div className="relative space-y-3">
              <div className="absolute bottom-4 left-4 top-4 w-px bg-border" />

              {financialFlow.map((item) => (
                <FinancialFlowItem
                  key={item.date.toISOString()}
                  item={item}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

interface FinancialFlowItemProps {
  item: FinancialFlowContract;
}

function FinancialFlowItem({
  item,
}: FinancialFlowItemProps) {
  return (
    <div className="relative flex gap-3">
      <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
        <CalendarDays className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1 rounded-xl border bg-card p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {formatDate(item.date)}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <FlowValue
                icon={
                  <ArrowUp className="size-3 text-emerald-600" />
                }
                value={item.income}
                className="text-emerald-600"
              />

              <FlowValue
                icon={
                  <ArrowDown className="size-3 text-destructive" />
                }
                value={item.expenses}
                className="text-destructive"
              />
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Saldo
            </p>

            <p
              className={[
                "mt-0.5 text-sm font-bold",
                item.isNegative
                  ? "text-destructive"
                  : "text-foreground",
              ].join(" ")}
            >
              {formatCurrency(item.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlowValueProps {
  icon: React.ReactNode;
  value: number;
  className?: string;
}

function FlowValue({
  icon,
  value,
  className,
}: FlowValueProps) {
  return (
    <span
      className={[
        "flex items-center gap-1 text-xs font-medium",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}

      {formatCurrency(value)}
    </span>
  );
}

function EmptyFinancialFlow() {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
        <CalendarDays className="size-5 text-muted-foreground" />
      </div>

      <p className="mt-3 text-sm font-medium">
        Nenhuma movimentação no período
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
        Os lançamentos aparecerão aqui conforme forem registrados.
      </p>
    </div>
  );
}