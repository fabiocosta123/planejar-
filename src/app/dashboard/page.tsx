import { auth } from "../../lib/auth";

import { familyContextService } from "../../services/family-context.service";

import { settingsService } from "../../services/settings.service";

import { getFinancialDashboardAction } from "../../actions/financial/get-financial-dashboard.action";

import { Dashboard } from "../../components/dashboard/dashboard";
import { canAccessTightDay } from "../../domain/financial/rules/plan-access.rule";
import { readProCheckoutConfig } from "../../integrations/mycredit/config";

export default async function DashboardPage() {

  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    return null;
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

  const settings =
    await settingsService.getSettings(
      userId
    );

  const dashboard =
    await getFinancialDashboardAction(
      familyContext.familyMemberId,
      startDate,
      endDate,
      undefined,
      today,
      Number(settings.minimumReserve),
      canAccessTightDay(settings.plan)
    );

  return (
    <Dashboard
      userName={session?.user?.name}
      dashboard={dashboard}
      showTightDay={settings.dayOfTightnessAlert}
      plan={settings.plan}
      proAmount={readProCheckoutConfig().amount}
    />
  );
}