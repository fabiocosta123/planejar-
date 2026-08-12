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
  if (financialFlow.length === 0) {
    return (
      <section
        className="mt-6"
        aria-label="Fluxo financeiro"
      >
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div>
            <h2 className="text-base font-semibold">
              Fluxo financeiro
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não há movimentações para este período.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mt-6"
      aria-label="Fluxo financeiro"
    >
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div>
          <h2 className="text-base font-semibold">
            Fluxo financeiro
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe a evolução das suas finanças.
          </p>
        </div>

        <div className="mt-5 divide-y">
          {financialFlow.map((flow) => (
            <div
              key={flow.date.toISOString()}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {formatDate(flow.date)}
                </p>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="text-emerald-600">
                    + {formatCurrency(flow.income)}
                  </span>

                  <span className="text-red-600">
                    - {formatCurrency(flow.expenses)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">
                  Saldo
                </p>

                <p
                  className={
                    flow.isNegative
                      ? "text-sm font-semibold text-red-600"
                      : "text-sm font-semibold text-emerald-600"
                  }
                >
                  {formatCurrency(flow.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}