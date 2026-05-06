"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthSplitLayoutProps = {
  children: ReactNode;
  /** Título grande no painel esquerdo */
  headline: string;
  /** Texto de apoio abaixo do título */
  subheadline: string;
  /** Texto curto opcional acima do headline (ex.: passo 2 de 2) */
  kicker?: string;
};

export function AuthSplitLayout({
  children,
  headline,
  subheadline,
  kicker,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 lg:flex-row">
      <aside className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-950 px-8 py-10 text-white lg:min-h-screen lg:w-[44%] lg:max-w-xl lg:shrink-0 lg:px-12 lg:py-14">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-emerald-400/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white/95 transition hover:text-white"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-lg shadow-inner backdrop-blur-sm">
              🐾
            </span>
            ViverPets
          </Link>
          {kicker ? (
            <p className="mt-10 text-xs font-medium uppercase tracking-widest text-emerald-200/90">
              {kicker}
            </p>
          ) : null}
          <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white lg:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-emerald-100/85 lg:text-lg">
            {subheadline}
          </p>
        </div>
        <p className="relative mt-8 text-xs text-emerald-200/70 lg:mt-0">
          Sistema white label para clínicas veterinárias
        </p>
      </aside>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
