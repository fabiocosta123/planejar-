import type { DashboardContract } from "@/contracts/financial/dashboard.contract";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSummary } from "./dashboard-summary";
import { BottomNavigation } from "./bottom-navigation";
import { DashboardFutureBalance } from "./dashboard-future-balance";

interface DashboardProps {
  userName?: string | null;
  dashboard: DashboardContract;
}

export function Dashboard({
  userName,
  dashboard,
}: DashboardProps) {
  return (
    <main className="min-h-dvh bg-muted/30">
      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <DashboardHeader userName={userName} />

        <DashboardSummary
          summary={dashboard.summary}
        />

        <DashboardFutureBalance
          futureBalance={dashboard.futureBalance}
        />
      </div>

      <BottomNavigation />
    </main>
  );
}