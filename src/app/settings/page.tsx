import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

import { auth } from "../../lib/auth";
import { settingsService } from "../../services/settings.service";
import { readProCheckoutConfig } from "../../integrations/mycredit/config";
import { SettingsForm } from "../../components/settings/settings-form";
import { BottomNavigation } from "../../components/dashboard/bottom-navigation";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await settingsService.getSettings(userId);
  const reserve = Number(settings.minimumReserve);

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
            <p className="text-sm text-muted-foreground">
              {session.user?.name ?? "Sua conta"}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          </div>
        </header>

        <SettingsForm
          minimumReserve={reserve.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          dayOfTightnessAlert={settings.dayOfTightnessAlert}
          notificationLevel={settings.notificationLevel}
          plan={settings.plan}
          proAmount={readProCheckoutConfig().amount}
        />
      </div>
      <BottomNavigation />
    </main>
  );
}
