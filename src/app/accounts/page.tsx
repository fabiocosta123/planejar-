import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

import { auth } from "../../lib/auth";
import { familyContextService } from "../../services/family-context.service";
import { familyMemberService } from "../../services/family-member.service";
import { accountsService } from "../../services/accounts.service";
import { AccountsScreen } from "../../components/accounts/accounts-screen";
import { BottomNavigation } from "../../components/dashboard/bottom-navigation";

export default async function AccountsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const familyContext = await familyContextService.getCurrentContext(userId);

  if (!familyContext) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Nenhuma família encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível identificar o contexto financeiro deste usuário.
          </p>
        </div>
      </main>
    );
  }

  const [accounts, member] = await Promise.all([
    accountsService.listForLedger(familyContext.ledgerMemberId),
    familyMemberService.findById(familyContext.familyMemberId),
  ]);

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <header className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dashboard">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Saldo compartilhado</p>
            <h1 className="text-2xl font-semibold tracking-tight">Contas</h1>
          </div>
        </header>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Cada lançamento cai em uma destas contas. A marcada entra pronta no formulário.
        </p>

        <AccountsScreen
          accounts={accounts}
          canWrite={member?.role !== "VIEWER"}
        />
      </div>
      <BottomNavigation />
    </main>
  );
}
