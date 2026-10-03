import {
  ArrowDown,
  ArrowUp,
  ReceiptText,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  TransactionSummaryContract,
} from "@/contracts/financial/transaction-summary.contract";

interface TransactionsListProps {

  transactions:
    TransactionSummaryContract[];

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

function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
    }
  )
    .format(new Date(date))
    .replace(".", "");

}

export function TransactionsList({
  transactions,
}: TransactionsListProps) {

  return (
    <section
      className="mt-6"
      aria-label="Lista de lançamentos"
    >

      <div className="mb-3 flex items-center justify-between">

        <h2 className="text-base font-semibold">
          Lançamentos
        </h2>

        <span className="text-xs text-muted-foreground">
          {transactions.length} lançamento
          {transactions.length === 1
            ? ""
            : "s"}
        </span>

      </div>


      {transactions.length === 0 ? (

        <Card>

          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">

            <div className="flex size-12 items-center justify-center rounded-full bg-muted">

              <ReceiptText className="size-6 text-muted-foreground" />

            </div>

            <h3 className="mt-4 font-medium">
              Nenhum lançamento
            </h3>

            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Toque em + para registrar o primeiro lançamento.
            </p>

          </CardContent>

        </Card>

      ) : (

        <div className="space-y-2">

          {transactions.map(
            transaction => {

              const isIncome =
                transaction.type === "INCOME";

              return (
                <Card
                  key={transaction.id}
                  className="rounded-2xl"
                >

                  <CardContent className="p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={[
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",

                            isIncome
                              ? "bg-emerald-500/10"
                              : "bg-destructive/10",
                          ].join(" ")}
                        >

                          {isIncome ? (

                            <ArrowUp
                              className="size-5 text-emerald-600"
                            />

                          ) : (

                            <ArrowDown
                              className="size-5 text-destructive"
                            />

                          )}

                        </div>


                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium">
                            {transaction.description}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(transaction.date)}
                            {transaction.status === "PENDING"
                              ? " · Pendente"
                              : transaction.status === "CANCELED"
                                ? " · Cancelado"
                                : ""}
                          </p>

                        </div>

                      </div>


                      <p
                        className={[
                          "shrink-0 text-sm font-semibold",

                          isIncome
                            ? "text-emerald-600"
                            : "text-destructive",
                        ].join(" ")}
                      >
                        {isIncome
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </p>

                    </div>

                  </CardContent>

                </Card>
              );

            }
          )}

        </div>

      )}

    </section>
  );

}