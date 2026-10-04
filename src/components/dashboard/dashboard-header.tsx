import { Bell } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userName?: string | null;
  unreadCount?: number;
}

export function DashboardHeader({
  userName,
  unreadCount = 0,
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
        <a
          href="#avisos"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "relative size-10 rounded-full hover:bg-muted"
          )}
          aria-label={
            unreadCount === 1
              ? "1 aviso não lido"
              : unreadCount > 1
                ? `${unreadCount} avisos não lidos`
                : "Avisos"
          }
        >
          <Bell className="size-5" />

          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-white">
              {unreadCount}
            </span>
          ) : null}
        </a>

        <Avatar className="size-10 border">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}