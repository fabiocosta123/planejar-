import { DashboardHeader } from "./dashboard-header";
import { BottomNavigation } from "./bottom-navigation";

interface DashboardProps {
  userName?: string | null;
}

export function Dashboard({
  userName,
}: DashboardProps) {
  return (
    <main className="min-h-dvh bg-muted/30">
      <div className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
        <DashboardHeader userName={userName} />

        <section
          className="mt-6"
          aria-label="Resumo financeiro"
        >
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Saldo atual
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              R$ 0,00
            </p>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}