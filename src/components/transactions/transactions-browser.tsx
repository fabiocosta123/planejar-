"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import type { TransactionSummaryContract } from "@/contracts/financial/transaction-summary.contract";
import type { SubscriptionPlan } from "@/domain/financial/rules/transaction-history-window.rule";

import { TransactionsList } from "./transactions-list";

const PREVIEW_SIZE = 5;

interface TransactionsBrowserProps {
  transactions: TransactionSummaryContract[];
  plan: SubscriptionPlan;
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function monthKey(value: Date | string) {
  const date = toDate(value);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

export function TransactionsBrowser({
  transactions,
  plan,
}: TransactionsBrowserProps) {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const months = useMemo(() => {
    const keys = new Set(
      transactions.map((transaction) => monthKey(transaction.date))
    );

    return [...keys].sort((left, right) => right.localeCompare(left));
  }, [transactions]);

  const filtered = transactions.filter((transaction) => {
    const description = transaction.description
      .toLocaleLowerCase("pt-BR");
    const term = query.trim().toLocaleLowerCase("pt-BR");
    const matchesQuery = term.length === 0 || description.includes(term);
    const matchesMonth = month === "all" || monthKey(transaction.date) === month;

    return matchesQuery && matchesMonth;
  });

  const visible = expanded
    ? filtered
    : filtered.slice(0, PREVIEW_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setExpanded(false);
  }

  function updateMonth(value: string) {
    setMonth(value);
    setExpanded(false);
  }

  return (
    <div className="mt-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="transaction-search" className="text-sm font-medium">
            Buscar lançamentos
          </label>
          <input
            id="transaction-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Descrição"
            className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="transaction-month" className="text-sm font-medium">
            Mês
          </label>
          <select
            id="transaction-month"
            value={month}
            onChange={(event) => updateMonth(event.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos no período</option>
            {months.map((key) => (
              <option key={key} value={key}>
                {monthLabel(key)}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-muted-foreground">
          {plan === "PRO"
            ? "A busca da versão Pro não tem limite de tempo."
            : "A versão gratuita busca os últimos 3 meses."}
        </p>
      </div>

      <TransactionsList
        transactions={visible}
        emptyTitle={
          transactions.length === 0
            ? "Nenhum lançamento"
            : "Nenhum lançamento encontrado"
        }
        emptyDescription={
          transactions.length === 0
            ? "Toque em + para registrar o primeiro lançamento."
            : "Tente outra descrição ou outro mês."
        }
      />

      {filtered.length > PREVIEW_SIZE ? (
        <Button
          type="button"
          variant="outline"
          className="mt-3 h-11 w-full"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Mostrar menos" : "Mostrar mais"}
        </Button>
      ) : null}
    </div>
  );
}
