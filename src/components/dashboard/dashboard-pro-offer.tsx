"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  confirmProPaymentAction,
  getProPayerAction,
  simulateProPaymentAction,
  startProCheckoutAction,
} from "../../actions/billing/pro-checkout.action";
import type { ProCheckoutView } from "../../contracts/financial/pro-checkout.contract";
import { formatTaxDocument } from "../../domain/billing/tax-document";

const inputClass =
  "h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-primary";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function DashboardProOffer({
  amount,
  variant = "card",
}: {
  amount: number;
  variant?: "card" | "button";
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState<ProCheckoutView | null>(null);
  const [paid, setPaid] = useState(false);
  const [payerOpen, setPayerOpen] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerDocument, setPayerDocument] = useState("");

  useEffect(() => {
    if (!charge || paid) {
      return;
    }

    const idFaturaPag = charge.idFaturaPag;
    let stopped = false;

    async function lookUp() {
      const result = await confirmProPaymentAction(idFaturaPag);

      if (stopped) {
        return;
      }

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      if (result.result.kind === "paid") {
        setPaid(true);
        router.refresh();
      }
    }

    void lookUp();
    const timer = setInterval(() => {
      void lookUp();
    }, 5000);

    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [charge, paid, router]);

  async function openPayer() {
    setError("");
    setLoading(true);
    const result = await getProPayerAction();
    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setPayerName(result.result.name);
    setPayerDocument(formatTaxDocument(result.result.document));
    setPayerOpen(true);
  }

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError("");
    setLoading(true);
    const result = await startProCheckoutAction({
      name: payerName,
      document: payerDocument,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setPayerOpen(false);

    if (result.result.kind === "already-pro") {
      router.refresh();
      return;
    }

    setCharge(result.result.charge);
  }

  async function simulate() {
    if (!charge) {
      return;
    }

    setError("");
    setLoading(true);
    const result = await simulateProPaymentAction(charge.idFaturaPag);
    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    if (result.result.kind === "paid") {
      setPaid(true);
      router.refresh();
    }
  }

  async function copyCode() {
    if (!charge) {
      return;
    }

    try {
      await navigator.clipboard.writeText(charge.copyPaste);
    } catch {
      setError("Não foi possível copiar. Selecione o código e copie.");
    }
  }

  const payerDialog = payerOpen && !charge ? createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="pro-payer-title"
        onSubmit={(event) => void start(event)}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
      >
        <h2 id="pro-payer-title" className="text-lg font-semibold">
          Dados de quem vai pagar
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          A MyCredit usa estes dados para identificar o PIX.
        </p>
        <div className="mt-4 space-y-2">
          <label htmlFor="payer-name" className="text-sm font-medium">
            Nome completo
          </label>
          <input
            id="payer-name"
            value={payerName}
            onChange={(event) => setPayerName(event.target.value)}
            required
            maxLength={100}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="mt-4 space-y-2">
          <label htmlFor="payer-document" className="text-sm font-medium">
            CPF ou CNPJ
          </label>
          <input
            id="payer-document"
            value={payerDocument}
            onChange={(event) => setPayerDocument(formatTaxDocument(event.target.value))}
            required
            inputMode="numeric"
            placeholder="000.000.000-00"
            className={inputClass}
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <div className="mt-6 grid gap-2">
          <Button type="submit" className="h-11" disabled={loading}>
            {loading ? "Gerando PIX..." : "Gerar PIX"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={loading}
            onClick={() => {
              setPayerOpen(false);
              setError("");
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>,
    document.body
  ) : null;

  const dialog = charge ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-pix-title"
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-4 pb-8 shadow-lg sm:rounded-3xl sm:p-6"
          >
            <h2 id="pro-pix-title" className="text-lg font-semibold">
              {paid ? "Pro liberado" : "Pagar o Pro com PIX"}
            </h2>

            {paid ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pagamento confirmado. O dia do aperto já está nesta conta.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pague {formatCurrency(charge.amount)} no app do banco com PIX
                  Copia e Cola. O código expira em cerca de 10 minutos.
                </p>
                {charge.sandbox ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Este PIX é de teste. O banco não paga este código. Use
                    simular pagamento.
                  </p>
                ) : null}
                <textarea
                  readOnly
                  value={charge.copyPaste}
                  aria-label="Código PIX copia e cola"
                  className="mt-4 h-28 w-full resize-none rounded-md border bg-muted/40 p-3 text-xs break-all"
                />
                <div className="mt-4 grid gap-2">
                  <Button type="button" className="h-11" onClick={() => void copyCode()}>
                    Copiar código PIX
                  </Button>
                  {charge.sandbox ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      disabled={loading}
                      onClick={() => void simulate()}
                    >
                      {loading ? "Simulando..." : "Simular pagamento"}
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => {
                      setCharge(null);
                      setError("");
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </>
            )}

            {error ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {paid ? (
              <Button
                type="button"
                className="mt-6 h-11 w-full"
                onClick={() => setCharge(null)}
              >
                Ver o dia do aperto
              </Button>
            ) : null}
          </div>
        </div>
  ) : null;

  if (variant === "button") {
    return (
      <div className="mt-6">
        <Button
          type="button"
          className="h-11 w-full"
          onClick={() => void openPayer()}
          disabled={loading}
        >
          {loading && !payerOpen ? "Abrindo..." : "Liberar versão Pro"}
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatCurrency(amount)} · pagamento único por PIX.
        </p>
        {error && !charge && !payerOpen ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {payerDialog}
        {dialog}
      </div>
    );
  }

  return (
    <section className="mt-4" aria-label="Versão Pro">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Dia do aperto
        </p>
        <p className="mt-2 text-lg font-semibold">
          Veja quando separar dinheiro
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          O Pro mostra o dia em que o saldo fica abaixo da reserva e quanto
          juntar por dia. A versão grátis não calcula essa previsão.
        </p>
        <Button
          type="button"
          className="mt-4 h-11 w-full"
          onClick={() => void openPayer()}
          disabled={loading}
        >
          {loading && !payerOpen ? "Abrindo..." : `Liberar o Pro por ${formatCurrency(amount)}`}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Pagamento único por PIX. O Pro entra nesta conta quando o pagamento é confirmado.
        </p>
        {error && !charge && !payerOpen ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
      {payerDialog}
      {dialog}
    </section>
  );
}
