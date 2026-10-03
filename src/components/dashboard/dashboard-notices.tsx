"use client";

import { useTransition } from "react";

import { markNotificationReadAction } from "../../actions/notifications/mark-notification-read.action";
import type { NoticeContract } from "../../services/notifications.service";
import { Button } from "../ui/button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function DashboardNotices({ notices }: { notices: NoticeContract[] }) {
  const [pending, startTransition] = useTransition();

  if (notices.length === 0) {
    return null;
  }

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
    });
  }

  return (
    <section id="avisos" className="mt-4 space-y-3" aria-label="Avisos">
      <h2 className="text-sm font-medium text-muted-foreground">Avisos</h2>
      <ul className="space-y-2">
        {notices.map((notice) => {
          const incoming = notice.movementType === "INCOME";

          return (
            <li
              key={notice.id}
              className="rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{notice.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {notice.actorName
                      ? `${notice.actorName} lançou ${notice.description}.`
                      : notice.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(notice.createdAt)}
                  </p>
                </div>
                <p
                  className={
                    incoming
                      ? "shrink-0 text-sm font-semibold text-emerald-700"
                      : "shrink-0 text-sm font-semibold text-red-600"
                  }
                >
                  {formatCurrency(notice.amount)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3 h-10"
                disabled={pending}
                onClick={() => markRead(notice.id)}
              >
                Marcar como lida
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
