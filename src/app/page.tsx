import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  CalendarClock,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "../lib/auth";

const freeFeatures = [
  {
    icon: ArrowLeftRight,
    title: "Lançamentos",
    description:
      "Registre entradas e saídas do mês, com valor em reais e data.",
  },
  {
    icon: Wallet,
    title: "Contas e saldo",
    description:
      "Acompanhe o saldo até hoje e o resumo de entradas e saídas.",
  },
];

const proFeatures = [
  {
    icon: CalendarClock,
    title: "Dia do aperto",
    description:
      "O app encontra o primeiro dia em que o saldo fica abaixo da reserva.",
  },
  {
    icon: Bell,
    title: "Quanto juntar por dia",
    description:
      "Divide o buraco pelos dias que faltam e avisa antes da conta fechar no vermelho.",
  },
];

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-dvh bg-muted/30">
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-sm font-medium text-muted-foreground">
          Planejamento Financeiro
        </p>

        <h1 className="mt-3 max-w-md text-3xl font-semibold tracking-tight">
          Saiba o dia em que o dinheiro aperta.
        </h1>

        <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground">
          A versão gratuita organiza os lançamentos do mês. A Pro avisa
          o dia do aperto e quanto guardar por dia para cobrir essa diferença.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11">
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              {isLoggedIn ? "Abrir o painel" : "Entrar"}
            </Link>
          </Button>

          {!isLoggedIn ? (
            <Button asChild variant="outline" className="h-11">
              <a href="#free-plan">Ver a versão grátis</a>
            </Button>
          ) : null}
        </div>

        <section className="mt-10" aria-labelledby="free-plan">
          <h2 id="free-plan" className="text-lg font-semibold">
            Grátis
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            O controle do mês, como em um app de lançamentos.
          </p>

          <ul className="mt-4 space-y-3">
            {freeFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="pro-plan">
          <div className="flex items-center gap-2">
            <h2 id="pro-plan" className="text-lg font-semibold">
              Pro
            </h2>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
              Em breve
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A previsão que justifica a assinatura. Ainda não está liberada.
          </p>

          <ul className="mt-4 space-y-3">
            {proFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Wallet;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-5 text-primary" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  );
}
