import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
} from "lucide-react";

import Link from "next/link";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  TransactionSummaryContract,
} from "@/contracts/financial/transaction-summary.contract";

import {
  TransactionsList,
} from "../transactions/transactions-list";

import { TransactionCreateButton } from "./transaction-create-button";
import { BottomNavigation } from "../dashboard/bottom-navigation";

interface TransactionsProps {

  transactions:
    TransactionSummaryContract[];

  accounts: {
    id: string;
    name: string;
  }[];

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

export function Transactions({
  transactions,
  accounts,
}: TransactionsProps) {

  const counted =
    transactions.filter(
      (transaction) =>
        transaction.status !== "CANCELED"
    );

  const income =
    counted
      .filter(
        transaction =>
          transaction.type === "INCOME"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  const expenses =
    counted
      .filter(
        transaction =>
          transaction.type === "EXPENSE"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  return (
    <main className="min-h-dvh bg-muted/30">

      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">

        {/* Header */}

        <header className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Link href="/dashboard">
                <ArrowLeft className="size-5" />
                <span className="sr-only">
                  Voltar
                </span>
              </Link>
            </Button>

            <div>

              <p className="text-sm text-muted-foreground">
                Movimentações
              </p>

              <h1 className="text-2xl font-semibold tracking-tight">
                Lançamentos
              </h1>

            </div>

          </div>

          <TransactionCreateButton
            accounts={accounts}
          />

        </header>


        {/* Resumo */}

        <section
          className="mt-6 grid grid-cols-2 gap-3"
          aria-label="Resumo dos lançamentos"
        >

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

              <p className="mt-3 text-lg font-semibold text-emerald-600">
                {formatCurrency(income)}
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

              <p className="mt-3 text-lg font-semibold text-destructive">
                {formatCurrency(expenses)}
              </p>

            </CardContent>

          </Card>

        </section>


        {/* Lista */}

        <TransactionsList
          transactions={transactions}
        />

      </div>

      <BottomNavigation />

    </main>
  );

}