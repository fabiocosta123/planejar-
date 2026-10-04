"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";

import {
  createLedgerAccountAction,
  setDefaultAccountAction,
} from "../../actions/accounts/ledger-account.action";
import type { LedgerAccountContract } from "../../contracts/accounts/ledger-account.contract";

const accountTypes = [
  { value: "CHECKING", label: "Conta corrente" },
  { value: "SAVINGS", label: "Poupança" },
  { value: "CASH", label: "Carteira" },
  { value: "INVESTMENT", label: "Investimento" },
  { value: "OTHER", label: "Outra" },
] as const;

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function AccountsScreen({
  accounts,
  canWrite,
}: {
  accounts: LedgerAccountContract[];
  canWrite: boolean;
}) {
  return (
    <div className="mt-6 space-y-3" aria-label="Lista de contas">
      {accounts.length === 0 ? (
        <p className="rounded-2xl border bg-card p-4 text-sm leading-6 text-muted-foreground">
          Cadastre a primeira conta para lançar entradas e saídas neste saldo.
        </p>
      ) : (
        <ul className="space-y-3">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="rounded-3xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{account.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {account.typeLabel}
                    {account.isDefault ? " · usada nos lançamentos" : ""}
                    {account.isActive ? "" : " · inativa"}
                  </p>
                </div>
                <p
                  className={
                    account.balance < 0
                      ? "shrink-0 text-sm font-semibold text-red-600"
                      : "shrink-0 text-sm font-semibold"
                  }
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
              {canWrite && account.isActive && !account.isDefault ? (
                <SetDefaultButton accountId={account.id} />
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {canWrite ? <AccountCreateButton /> : (
        <p className="text-sm text-muted-foreground">
          Seu acesso permite apenas consulta.
        </p>
      )}
    </div>
  );
}

function SetDefaultButton({ accountId }: { accountId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function choose() {
    setPending(true);
    await setDefaultAccountAction(accountId);
    setPending(false);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="mt-3 h-10"
      disabled={pending}
      onClick={() => void choose()}
    >
      Usar nos lançamentos
    </Button>
  );
}

function AccountCreateButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("CHECKING");
  const [initialBalance, setInitialBalance] = useState("0,00");
  const [initialBalanceDate, setInitialBalanceDate] = useState(todayInputValue);
  const [useAsDefault, setUseAsDefault] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function close() {
    if (loading) {
      return;
    }

    setOpen(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await createLedgerAccountAction({
      name,
      type,
      initialBalance,
      initialBalanceDate,
      useAsDefault,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setName("");
    setType("CHECKING");
    setInitialBalance("0,00");
    setUseAsDefault(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button type="button" className="h-11" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nova conta
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-account-title"
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="new-account-title" className="text-lg font-semibold">
                Nova conta
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

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="account-name" className="text-sm font-medium">
                  Nome
                </label>
                <input
                  id="account-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={60}
                  autoFocus
                  className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="account-type" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="account-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                >
                  {accountTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="initial-balance" className="text-sm font-medium">
                  Saldo inicial
                </label>
                <input
                  id="initial-balance"
                  inputMode="decimal"
                  value={initialBalance}
                  onChange={(event) => setInitialBalance(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="initial-balance-date" className="text-sm font-medium">
                  Data do saldo inicial
                </label>
                <DateInput
                  id="initial-balance-date"
                  value={initialBalanceDate}
                  onChange={setInitialBalanceDate}
                  required
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border p-3">
                <input
                  id="use-as-default"
                  type="checkbox"
                  checked={useAsDefault}
                  onChange={(event) => setUseAsDefault(event.target.checked)}
                  className="mt-1 size-5"
                />
                <label htmlFor="use-as-default" className="text-sm font-medium">
                  Usar nos novos lançamentos
                </label>
              </div>

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="h-11 w-full" disabled={loading}>
                {loading ? "Salvando..." : "Criar conta"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
