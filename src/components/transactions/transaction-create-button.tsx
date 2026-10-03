"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { createTransactionAction } from "../../actions/transactions/create-transaction.action";

interface AccountOption {
  id: string;
  name: string;
}

interface TransactionCreateButtonProps {
  accounts: AccountOption[];
}

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

export function TransactionCreateButton({
  accounts,
}: TransactionCreateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [transactionDate, setTransactionDate] = useState(todayInputValue);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function close() {
    if (loading) {
      return;
    }

    setOpen(false);
    setError("");
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        setOpen(false);
        setError("");
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await createTransactionAction({
      accountId,
      description,
      amount,
      type,
      transactionDate,
      notes,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setDescription("");
    setAmount("");
    setNotes("");
    setType("EXPENSE");
    setTransactionDate(todayInputValue());
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        size="icon-lg"
        className="size-11 rounded-full"
        aria-label="Novo lançamento"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-5" />
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-transaction-title"
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="new-transaction-title"
                className="text-lg font-semibold"
              >
                Novo lançamento
              </h2>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 rounded-full"
                aria-label="Fechar"
                onClick={close}
              >
                <X className="size-5" />
              </Button>
            </div>

            {accounts.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Cadastre uma conta antes de registrar um lançamento.
              </p>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={type === "EXPENSE" ? "default" : "outline"}
                    className="h-11"
                    aria-pressed={type === "EXPENSE"}
                    onClick={() => setType("EXPENSE")}
                  >
                    Saída
                  </Button>

                  <Button
                    type="button"
                    variant={type === "INCOME" ? "default" : "outline"}
                    className="h-11"
                    aria-pressed={type === "INCOME"}
                    onClick={() => setType("INCOME")}
                  >
                    Entrada
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    maxLength={120}
                    autoFocus
                    className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Valor
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0,00"
                    required
                    className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="account" className="text-sm font-medium">
                    Conta
                  </label>
                  <select
                    id="account"
                    name="account"
                    value={accountId}
                    onChange={(event) => setAccountId(event.target.value)}
                    required
                    className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="transaction-date" className="text-sm font-medium">
                    Data
                  </label>
                  <input
                    id="transaction-date"
                    name="transactionDate"
                    type="date"
                    value={transactionDate}
                    onChange={(event) => setTransactionDate(event.target.value)}
                    required
                    className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {error ? (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Registrar lançamento"}
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
