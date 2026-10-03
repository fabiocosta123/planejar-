import type { DashboardContract } from "@/contracts/financial/dashboard.contract";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSummary } from "./dashboard-summary";
import { BottomNavigation } from "./bottom-navigation";
import { DashboardFutureBalance } from "./dashboard-future-balance";
import { DashboardFinancialFlow } from "./dashboard-financial-flow";
import { DashboardTightDay } from "./dashboard-tight-day";
import { DashboardProOffer } from "./dashboard-pro-offer";
import type { SubscriptionPlan } from "../../domain/financial/rules/transaction-history-window.rule";


interface DashboardProps {
  userName?: string | null;
  dashboard: DashboardContract;
  showTightDay?: boolean;
  plan: SubscriptionPlan;
  proAmount: number;
}

export function Dashboard({
  userName,
  dashboard,
  showTightDay = true,
  plan,
  proAmount,
}: DashboardProps) {
  return (
    <main className="min-h-dvh bg-muted/30">
      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <DashboardHeader userName={userName} />

        <DashboardSummary
          summary={dashboard.summary}
        />

        {showTightDay && plan === "PRO" ? (
          <DashboardTightDay
            data={dashboard.tightDay}
          />
        ) : null}

        {plan === "FREE" ? (
          <DashboardProOffer amount={proAmount} />
        ) : null}

        <DashboardFinancialFlow
          financialFlow={dashboard.financialFlow}
        />

        <DashboardFutureBalance
          data={dashboard.futureBalance}
        />
        
      </div>

      <BottomNavigation />
    </main>
  );
}