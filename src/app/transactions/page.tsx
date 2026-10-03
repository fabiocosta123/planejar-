import { redirect } from "next/navigation";

import { auth } from "../../lib/auth";

import { familyContextService } from "../../services/family-context.service";

import { accountsService } from "../../services/accounts.service";

import { getTransactionsAction } from "../../actions/transactions/get-transactions.action";

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

  const startDate =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

  const endDate =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

  const [transactions, accounts] =
    await Promise.all([
      getTransactionsAction(
        familyContext.familyMemberId,
        startDate,
        endDate
      ),
      accountsService.findByFamilyMember(
        familyContext.familyMemberId
      ),
    ]);

  return (
    <Transactions
      transactions={transactions}
      accounts={accounts.map((account) => ({
        id: account.id,
        name: account.name,
      }))}
    />
  );

}