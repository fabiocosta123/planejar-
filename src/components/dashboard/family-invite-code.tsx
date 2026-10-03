"use client";

import { useState } from "react";

import { Button } from "../ui/button";

export function FamilyInviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className="mt-4 rounded-2xl border border-primary/20 bg-card p-4 shadow-sm"
      aria-label="Código da família"
    >
      <p className="text-sm font-medium text-muted-foreground">
        Código da família
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-[0.2em] text-primary">
        {code}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Quem não é o usuário principal usa esse código no cadastro e lança neste mesmo saldo, no próprio celular.
      </p>
      <Button type="button" variant="outline" className="mt-3 h-11" onClick={() => void copy()}>
        {copied ? "Código copiado" : "Copiar código"}
      </Button>
    </section>
  );
}
