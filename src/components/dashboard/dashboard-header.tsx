import { Bell } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string | null;
}

export function DashboardHeader({
  userName,
}: DashboardHeaderProps) {
  const firstName =
    userName?.trim().split(" ")[0] || "Usuário";

  const initials =
    firstName.charAt(0).toUpperCase();

  return (
    <header
      className="flex items-center justify-between"
      aria-label="Cabeçalho do dashboard"
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">
          Olá,
        </p>

        <h1 className="mt-0.5 truncate text-2xl font-bold tracking-tight">
          {firstName}
        </h1>

        <p className="mt-1 text-xs text-muted-foreground">
          Veja como estão suas finanças hoje
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-full hover:bg-muted"
          aria-label="Notificações"
        >
          <Bell className="size-5" />

          {/* Indicador de notificações.
              Remover quando o sistema de notificações
              estiver implementado. */}
          <span
            className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background"
            aria-hidden="true"
          />
        </Button>

        <Avatar className="size-10 border">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}