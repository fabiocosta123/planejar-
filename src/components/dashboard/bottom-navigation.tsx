"use client";

import {
  ArrowLeftRight,
  Home,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Início",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Lançamentos",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Contas",
    href: "/accounts",
    icon: Wallet,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 shadow-[0_-8px_24px_oklch(0.27_0.04_160/0.06)] backdrop-blur"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-around px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex min-w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-primary/10 px-2 py-1.5 text-primary"
                  : "flex min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              }
            >
              <Icon className="size-5" />

              <span className="text-[11px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
