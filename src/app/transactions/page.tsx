import { redirect } from "next/navigation";

import { auth } from "../../lib/auth";

import { familyContextService } from "../../services/family-context.service";

import { accountsService } from "../../services/accounts.service";

import { settingsService } from "../../services/settings.service";

import { familyMemberService } from "../../services/family-member.service";

import { transactionsService } from "../../services/transactions.service";

import { getTransactionHistoryAction } from "../../actions/transactions/get-transaction-history.action";

import { Transactions } from "../../components/transactions/transactions";

export default async function TransactionsPage() {

  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const familyContext =
    await familyContextService.getCurrentContext(
      userId
    );

  if (!familyContext) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="text-center">

          <h1 className="text-xl font-semibold">
            Nenhuma família encontrada
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível identificar o contexto financeiro deste usuário.
          </p>

        </div>
      </main>
    );
  }

  const today =
    new Date();

  const settings =
    await settingsService.getSettings(userId);

  const [history, accounts, series, member] =
    await Promise.all([
      getTransactionHistoryAction(
        familyContext.ledgerMemberId,
        settings.plan,
        today
      ),
      accountsService.findByFamilyMember(
        familyContext.ledgerMemberId
      ),
      transactionsService.listSeries(
        familyContext.ledgerMemberId
      ),
      familyMemberService.findById(
        familyContext.familyMemberId
      ),
    ]);

  return (
    <Transactions
      transactions={history.transactions}
      currentMonth={history.currentMonth}
      comparison={history.comparison}
      plan={history.plan}
      accounts={accounts.map((account) => ({
        id: account.id,
        name: account.name,
      }))}
      series={series}
      canManageSeries={member?.role !== "VIEWER"}
    />
  );

}