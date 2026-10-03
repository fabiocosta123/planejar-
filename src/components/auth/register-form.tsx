"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { registerAction } from "../../actions/auth/register.action";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [principal, setPrincipal] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await registerAction({
      name,
      email,
      password,
      principal,
      inviteCode,
    });

    if (!result.success) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const session = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (session?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
            P
          </div>
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            O usuário principal abre o saldo da família. Os outros entram com o código e lançam nesse mesmo saldo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              aria-pressed={principal}
              onClick={() => setPrincipal(true)}
              className={
                principal
                  ? "rounded-2xl border border-primary bg-primary/10 px-4 py-3 text-left"
                  : "rounded-2xl border px-4 py-3 text-left"
              }
            >
              <span className="block font-medium">Sou o usuário principal</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Você abre a família e o saldo.
              </span>
            </button>
            <button
              type="button"
              aria-pressed={!principal}
              onClick={() => setPrincipal(false)}
              className={
                !principal
                  ? "rounded-2xl border border-primary bg-primary/10 px-4 py-3 text-left"
                  : "rounded-2xl border px-4 py-3 text-left"
              }
            >
              <span className="block font-medium">Vou usar o saldo de outra pessoa</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Por exemplo, um filho lançando uma compra no celular.
              </span>
            </button>
          </div>

          {!principal ? (
            <div className="space-y-2">
              <label htmlFor="invite-code" className="text-sm font-medium">
                Código da família
              </label>
              <input
                id="invite-code"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                autoCapitalize="characters"
                required
                className="h-11 w-full rounded-xl border bg-background px-3 font-mono tracking-[0.2em] uppercase outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              className="h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              className="h-11 w-full rounded-xl border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
