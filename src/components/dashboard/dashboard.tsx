import type { DashboardContract } from "@/contracts/financial/dashboard.contract";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSummary } from "./dashboard-summary";
import { BottomNavigation } from "./bottom-navigation";
import { DashboardFutureBalance } from "./dashboard-future-balance";
import { DashboardFinancialFlow } from "./dashboard-financial-flow";
import { DashboardTightDay } from "./dashboard-tight-day";
import { DashboardProOffer } from "./dashboard-pro-offer";
import { FamilyInviteCode } from "./family-invite-code";
import { DashboardNotices } from "./dashboard-notices";
import type { SubscriptionPlan } from "../../domain/financial/rules/transaction-history-window.rule";
import type { NoticeContract } from "../../services/notifications.service";


interface DashboardProps {
  userName?: string | null;
  dashboard: DashboardContract;
  showTightDay?: boolean;
  plan: SubscriptionPlan;
  proAmount: number;
  inviteCode?: string | null;
  notices?: NoticeContract[];
}

export function Dashboard({
  userName,
  dashboard,
  showTightDay = true,
  plan,
  proAmount,
  inviteCode,
  notices = [],
}: DashboardProps) {
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <DashboardHeader userName={userName} unreadCount={notices.length} />

        {inviteCode ? <FamilyInviteCode code={inviteCode} /> : null}

        <DashboardNotices notices={notices} />

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