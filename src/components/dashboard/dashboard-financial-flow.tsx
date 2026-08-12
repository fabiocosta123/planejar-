import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react";

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
    month: "2-digit",
  }).format(new Date(date));
}

export function DashboardFinancialFlow({
  financialFlow,
}: DashboardFinancialFlowProps) {
  return (
    <section
      className="mt-4"
      aria-label="Fluxo financeiro"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
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
        </CardHeader>

        <CardContent>
          {financialFlow.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">
                Nenhuma movimentação no período
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Os lançamentos aparecerão aqui conforme forem registrados.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {financialFlow.map((item) => (
                <div
                  key={item.date.toISOString()}
                  className="rounded-xl border p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <CalendarDays className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {formatDate(item.date)}
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ArrowUp className="size-3" />
                            {formatCurrency(item.income)}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ArrowDown className="size-3" />
                            {formatCurrency(item.expenses)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-muted-foreground">
                        Saldo
                      </p>

                      <p
                        className={[
                          "text-sm font-semibold",
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}