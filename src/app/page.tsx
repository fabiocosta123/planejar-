import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  CalendarRange,
  Landmark,
  Repeat,
  ScrollText,
  Wallet,
} from "lucide-react";

import { DashboardProOffer } from "@/components/dashboard/dashboard-pro-offer";
import { Button } from "@/components/ui/button";
import { auth } from "../lib/auth";
import { readProCheckoutConfig } from "../integrations/mycredit/config";
import { settingsService } from "../services/settings.service";

const freeFeatures = [
  {
    icon: ArrowLeftRight,
    title: "Lançamentos",
    description:
      "Registre entradas e saídas e veja os mais recentes na hora.",
  },
  {
    icon: Wallet,
    title: "Contas e saldo",
    description:
      "Acompanhe o saldo até hoje e o resumo de entradas e saídas.",
  },
  {
    icon: Repeat,
    title: "Repetir todo mês",
    description:
      "Aluguel e salário seguem para os próximos meses no dia do aperto.",
  },
  {
    icon: ScrollText,
    title: "Busca de 3 meses",
    description:
      "Encontre um lançamento pela descrição nos últimos 3 meses.",
  },
];

const proFeatures = [
  {
    icon: CalendarRange,
    title: "Dia do aperto",
    description:
      "Você vê com antecedência o dia em que o dinheiro fica curto.",
  },
  {
    icon: Bell,
    title: "Quanto juntar por dia",
    description:
      "Você sabe quanto separar por dia para chegar nesse dia com folga.",
  },
  {
    icon: Landmark,
    title: "Contas bancárias",
    description:
      "Conecte suas contas e acompanhe as movimentações sem lançar uma a uma.",
  },
  {
    icon: ScrollText,
    title: "Histórico de lançamentos",
    description:
      "Consulte entradas e saídas sem limite de tempo.",
  },
  {
    icon: ArrowLeftRight,
    title: "Comparativo",
    description:
      "Compare um mês com o outro e um ano com o outro.",
  },
];

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const isLoggedIn = Boolean(userId);
  const settings = userId ? await settingsService.getSettings(userId) : null;
  const proAmount = readProCheckoutConfig().amount;
  const proPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(proAmount);

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
          A versão gratuita organiza os lançamentos recentes. A Pro amplia
          o histórico, compara períodos e avisa quando o dinheiro vai apertar.
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
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Histórico completo, comparativo e o aviso de quando separar dinheiro.
          </p>

          <ul className="mt-4 space-y-3">
            {proFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </ul>

          {settings?.plan === "PRO" ? (
            <div className="mt-6">
              <Button asChild className="h-11 w-full">
                <Link href="/dashboard">Abrir o dia do aperto</Link>
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Versão Pro liberada nesta conta.
              </p>
            </div>
          ) : isLoggedIn ? (
            <DashboardProOffer amount={proAmount} variant="button" />
          ) : (
            <div className="mt-6">
              <Button asChild className="h-11 w-full">
                <Link href="/login">Liberar versão Pro</Link>
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                {proPrice} · pagamento único por PIX.
              </p>
            </div>
          )}
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
