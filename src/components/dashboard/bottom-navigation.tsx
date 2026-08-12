import {
  ArrowLeftRight,
  Home,
  Settings,
  Wallet,
} from "lucide-react";

import Link from "next/link";

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
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-around px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-16 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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