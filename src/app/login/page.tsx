"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();


    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();


  }

  return (<main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8"> <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-lg"> <div className="mb-8 text-center"> <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">P</div> <h1 className="text-2xl font-bold">
    Planejamento Financeiro </h1>

    <p className="mt-2 text-sm text-muted-foreground">
      Entre na sua conta
    </p>
  </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="seu@email.com"
          autoComplete="email"
          required
          className="h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Senha
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Sua senha"
          autoComplete="current-password"
          required
          className="h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">
      Ainda não tem conta?{" "}
      <Link href="/register" className="font-medium text-primary">
        Criar conta
      </Link>
    </p>
  </div>
  </main>
  );
}
