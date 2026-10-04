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

import type {
  HistoryComparisonContract,
  PeriodTotalsContract,
} from "@/contracts/financial/transaction-history.contract";

import type { SubscriptionPlan } from "@/domain/financial/rules/transaction-history-window.rule";

import type { SeriesContract } from "@/contracts/financial/series.contract";

import { SeriesList } from "./series-list";
import { TransactionsBrowser } from "./transactions-browser";
import { TransactionComparison } from "./transaction-comparison";
import { TransactionCreateButton } from "./transaction-create-button";
import { BottomNavigation } from "../dashboard/bottom-navigation";

interface TransactionsProps {
  transactions: TransactionSummaryContract[];
  currentMonth: PeriodTotalsContract;
  comparison: HistoryComparisonContract | null;
  plan: SubscriptionPlan;
  accounts: {
    id: string;
    name: string;
  }[];
  series: SeriesContract[];
  canManageSeries: boolean;
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
  currentMonth,
  comparison,
  plan,
  accounts,
  series,
  canManageSeries,
}: TransactionsProps) {
  const income = currentMonth.income;
  const expenses = currentMonth.expenses;

  return (
    <main className="min-h-dvh bg-background">

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

        {comparison ? (
          <TransactionComparison comparison={comparison} />
        ) : null}

        <SeriesList
          series={series}
          accounts={accounts}
          canManage={canManageSeries}
        />

        <TransactionsBrowser
          transactions={transactions}
          plan={plan}
        />

      </div>

      <BottomNavigation />

    </main>
  );

}