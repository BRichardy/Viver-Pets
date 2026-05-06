"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem =
  | { href: string; label: string; icon: string; soon?: false }
  | { label: string; icon: string; soon: true };

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Painel", icon: "▦" },
  { href: "/tutores", label: "Tutores", icon: "👤" },
  { href: "/pets", label: "Pets", icon: "🐕" },
  { href: "/agenda", label: "Agenda", icon: "📅" },
];

type MainAppShellProps = {
  children: React.ReactNode;
  clinicName: string;
  userEmail: string;
  roleLabel: string;
};

export function MainAppShell({
  children,
  clinicName,
  userEmail,
  roleLabel,
}: MainAppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
          aria-expanded={mobileOpen}
          aria-label="Abrir menu"
        >
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              d="M4 7h16M4 12h16M4 17h16"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {clinicName}
          </p>
          <p className="truncate text-xs text-zinc-500">ViverPets</p>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="lg:flex lg:min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:static lg:z-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="flex h-14 items-center gap-3 border-b border-zinc-100 px-4 lg:h-auto lg:flex-col lg:items-stretch lg:gap-4 lg:border-0 lg:px-5 lg:pt-8 lg:pb-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-zinc-50 lg:p-0 lg:hover:bg-transparent"
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white shadow-md shadow-emerald-600/20">
                🐾
              </span>
              <div className="min-w-0 lg:w-full">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {clinicName}
                </p>
                <p className="truncate text-xs text-zinc-500">ViverPets</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 lg:px-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Menu
            </p>
            {navItems.map((item) => {
              if ("soon" in item && item.soon) {
                return (
                  <div
                    key={item.label}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400"
                    title="Disponível em breve"
                  >
                    <span className="w-6 text-center text-base opacity-80">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-500">
                      breve
                    </span>
                  </div>
                );
              }

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
                    ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/15"
                    : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                >
                  <span className="w-6 text-center text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-100 p-4">
            <div className="rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200/80">
              <p className="truncate text-xs font-medium text-zinc-500">
                Sessão
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-zinc-900">
                {userEmail}
              </p>
              <p className="mt-1 text-xs text-emerald-700">{roleLabel}</p>
            </div>
            <div className="mt-3">
              <SignOutButton className="w-full justify-center" />
            </div>
            <Link
              href="/"
              className="mt-3 block text-center text-xs font-medium text-zinc-500 hover:text-emerald-700"
            >
              Página inicial pública
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
