
import { Bell } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";

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
    <header className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">
          Olá,
        </p>

        <h1 className="truncate text-2xl font-semibold tracking-tight">
          {firstName}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Notificações"
        >
          <Bell className="size-5" />
        </Button>

        <Avatar className="size-10">
          <AvatarFallback className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

