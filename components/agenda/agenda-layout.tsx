"use client";

import { cancelConsulta } from "@/app/(main)/agenda/actions";
import {
  AgendaGridContextMenu,
  type AgendaGridMenuItem,
} from "@/components/agenda/agenda-grid-context-menu";
import {
  datetimeLocalValueForSlot,
  groupConsultasByDaySlot,
  slotLabel,
  SLOT_COUNT,
  SLOT_END_HOUR,
  SLOT_MINUTES,
  SLOT_START_HOUR,
  type AgendaConsultaRow,
} from "@/lib/agenda/slots";
import {
  addDays,
  formatWeekRangePt,
  formatYmdLocal,
  isSameLocalCalendarDay,
  parseLocalDateFromYmd,
  shiftWeekMondayIso,
  startOfWeekMonday,
} from "@/lib/agenda/week";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type MouseEvent,
} from "react";

/** Scroll interno da grelha compacta: mais altura útil para slots clicáveis. */
const GRID_SCROLL_MAX =
  "max-h-[min(34rem,calc(100dvh-12rem))] sm:max-h-[min(38rem,calc(100dvh-13rem))]";

const timeHm = new Intl.DateTimeFormat("pt-PT", {
  hour: "2-digit",
  minute: "2-digit",
});

function consultaBlockTone(status: string): string {
  switch (status) {
    case "agendada":
      return "border-sky-200/90 bg-sky-50/95 text-sky-950";
    case "em_atendimento":
      return "border-amber-200/90 bg-amber-50/95 text-amber-950";
    case "concluida":
      return "border-emerald-200/90 bg-emerald-50/95 text-emerald-950";
    case "cancelada":
      return "border-zinc-200/80 bg-zinc-100/90 text-zinc-600";
    default:
      return "border-zinc-200/80 bg-white text-zinc-800";
  }
}

type AgendaTimeGridVariant = "compact" | "expanded";

function AgendaTimeGrid({
  days,
  hours,
  serverToday,
  variant,
  consultas,
  canSchedule,
  weekMondayIso,
}: {
  days: Date[];
  hours: number[];
  serverToday: Date;
  variant: AgendaTimeGridVariant;
  consultas: AgendaConsultaRow[];
  canSchedule: boolean;
  weekMondayIso: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    items: AgendaGridMenuItem[];
  } | null>(null);

  const bySlot = useMemo(
    () =>
      groupConsultasByDaySlot(
        consultas.filter((c) => c.status !== "cancelada"),
        days,
      ),
    [consultas, days],
  );

  const slotRow =
    variant === "expanded"
      ? "min-h-[3.5rem] sm:min-h-[4rem]"
      : "min-h-[2.875rem] sm:min-h-[3.25rem]";
  const gridCols =
    variant === "expanded"
      ? "[grid-template-columns:4rem_repeat(7,minmax(0,1fr))]"
      : "[grid-template-columns:3.25rem_repeat(7,minmax(0,1fr))]";
  const timeText =
    variant === "expanded"
      ? "text-[11px] sm:text-xs"
      : "text-[10px] font-medium";

  const gridMin =
    "min-w-[44rem] sm:min-w-[48rem] lg:min-w-full w-full";

  /** Mesma altura do canto + dias; sticky no topo dentro da *única* grelha com scroll. */
  const headerHeight = variant === "expanded" ? "h-14" : "h-12";

  function novoConsultaHref(whenLocal: string) {
    const q = new URLSearchParams();
    q.set("when", whenLocal);
    q.set("week", weekMondayIso);
    return `/agenda/novo?${q.toString()}`;
  }

  function goScheduleSlot(day: Date, slot: number) {
    if (!canSchedule) return;
    const when = datetimeLocalValueForSlot(day, slot);
    router.push(novoConsultaHref(when));
  }

  function openEmptyCellMenu(e: MouseEvent, day: Date, slot: number) {
    if (!canSchedule) return;
    e.preventDefault();
    e.stopPropagation();
    const when = datetimeLocalValueForSlot(day, slot);
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          id: "schedule",
          label: "Agendar consulta…",
          onSelect: () => router.push(novoConsultaHref(when)),
        },
      ],
    });
  }

  function openConsultaMenu(e: MouseEvent, c: AgendaConsultaRow) {
    e.preventDefault();
    e.stopPropagation();
    const items: AgendaGridMenuItem[] = [
      {
        id: "edit",
        label: "Editar…",
        disabled: !canSchedule,
        onSelect: () => {
          const q = new URLSearchParams();
          q.set("edit", c.id);
          q.set("week", weekMondayIso);
          router.push(`/agenda/novo?${q.toString()}`);
        },
      },
    ];
    if (canSchedule && c.status === "agendada") {
      items.push({
        id: "cancel",
        label: "Cancelar consulta",
        danger: true,
        onSelect: () => {
          const ok = window.confirm(
            `Cancelar a consulta de "${c.petName}" neste horário?`,
          );
          if (!ok) return;
          startTransition(async () => {
            const r = await cancelConsulta(c.id);
            if (r.error) {
              window.alert(r.error);
              return;
            }
            router.refresh();
          });
        },
      });
    }
    setMenu({ x: e.clientX, y: e.clientY, items });
  }

  const scrollClass =
    variant === "expanded"
      ? "min-h-0 flex-1 overflow-auto overscroll-y-contain [scrollbar-gutter:stable]"
      : `min-w-0 ${GRID_SCROLL_MAX} overflow-auto overscroll-y-contain [scrollbar-gutter:stable]`;

  const rootClass =
    variant === "expanded"
      ? "flex min-h-0 w-full flex-1 flex-col"
      : "w-full";

  return (
    <div className={rootClass}>
      {menu ? (
        <AgendaGridContextMenu
          key={`${menu.x}-${menu.y}-${menu.items.map((i) => i.id).join("-")}`}
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={() => setMenu(null)}
        />
      ) : null}
      <div className={scrollClass}>
        <div
          className={`grid ${gridMin} ${gridCols}`}
          role="grid"
          aria-label="Grade semanal da agenda"
        >
          <div
            className={`sticky top-0 left-0 z-[45] box-border ${headerHeight} border-b border-r border-zinc-200 bg-zinc-50 min-w-0`}
            aria-hidden
          />

          {days.map((day) => {
            const isToday = isSameLocalCalendarDay(day, serverToday);
            const weekday = new Intl.DateTimeFormat("pt-PT", {
              weekday: "short",
            }).format(day);
            const dayNum = new Intl.DateTimeFormat("pt-PT", {
              day: "numeric",
            }).format(day);
            return (
              <div
                key={`h-${day.toISOString()}`}
                className={`sticky top-0 z-[40] box-border flex ${headerHeight} min-w-0 flex-col items-center justify-center border-b border-r border-zinc-200 px-1 text-center ${isToday ? "bg-emerald-100" : "bg-white"}`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? "text-emerald-800" : "text-zinc-500"}`}
                >
                  {weekday}
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${isToday ? "text-emerald-950" : "text-zinc-900"}`}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}

          {hours.map((slot) => (
            <Fragment key={slot}>
              <div
                className={`sticky left-0 z-10 box-border flex ${slotRow} min-w-0 items-start justify-end overflow-hidden border-b border-r border-zinc-200 bg-zinc-50 py-0.5 pr-1.5 tabular-nums text-zinc-400 ${timeText}`}
              >
                {slotLabel(slot)}
              </div>
              {days.map((day, dayIndex) => {
                const isToday = isSameLocalCalendarDay(day, serverToday);
                const weekday = new Intl.DateTimeFormat("pt-PT", {
                  weekday: "short",
                }).format(day);
                const dayNum = new Intl.DateTimeFormat("pt-PT", {
                  day: "numeric",
                }).format(day);
                const keySlot = `${dayIndex}-${slot}`;
                const cellList = bySlot.get(keySlot) ?? [];
                const empty = cellList.length === 0;
                return (
                  <div
                    key={`${day.toISOString()}-${slot}`}
                    role="gridcell"
                    tabIndex={canSchedule && empty ? 0 : undefined}
                    aria-label={`${weekday} ${dayNum} · ${slotLabel(slot)}${canSchedule && empty ? ". Duplo clique para agendar." : ""}`}
                    title={
                      canSchedule && empty
                        ? "Duplo clique: agendar · Botão direito: menu"
                        : undefined
                    }
                    onDoubleClick={() => {
                      if (empty) goScheduleSlot(day, slot);
                    }}
                    onContextMenu={(e) => {
                      if (empty) openEmptyCellMenu(e, day, slot);
                    }}
                    className={`group relative ${slotRow} border-b border-r border-dashed border-zinc-200/90 transition hover:bg-emerald-50/25 ${isToday ? "bg-emerald-50/35" : "bg-white/60"} ${canSchedule && empty ? "cursor-cell" : ""}`}
                  >
                    {cellList.length > 0 ? (
                      <div className="absolute inset-1 z-[1] flex flex-col gap-1 overflow-y-auto overscroll-y-contain">
                        {cellList.map((c) => {
                          const at = new Date(c.scheduledAt);
                          const hm = Number.isNaN(at.getTime())
                            ? "—"
                            : timeHm.format(at);
                          return (
                            <div
                              key={c.id}
                              title="Botão direito: opções"
                              onContextMenu={(e) => openConsultaMenu(e, c)}
                              className={`min-h-0 shrink-0 rounded-md border px-2 py-1 shadow-sm ${consultaBlockTone(c.status)}`}
                            >
                              <p className="truncate text-[11px] font-semibold leading-snug sm:text-xs">
                                {c.petName}
                              </p>
                              <p className="text-[10px] tabular-nums opacity-90 sm:text-[11px]">
                                {hm}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgendaWeekToolbar({
  weekMondayIso,
  currentWeekMondayIso,
}: {
  weekMondayIso: string;
  currentWeekMondayIso: string;
}) {
  const prev = shiftWeekMondayIso(weekMondayIso, -1);
  const next = shiftWeekMondayIso(weekMondayIso, 1);
  const weekStart = parseLocalDateFromYmd(weekMondayIso);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/agenda?week=${prev}`}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100"
        aria-label="Semana anterior"
        scroll={false}
      >
        ‹
      </Link>
      <Link
        href={`/agenda?week=${currentWeekMondayIso}`}
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
        scroll={false}
      >
        Hoje
      </Link>
      <Link
        href={`/agenda?week=${next}`}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100"
        aria-label="Próxima semana"
        scroll={false}
      >
        ›
      </Link>
      <p className="w-full pl-0 text-sm font-medium text-zinc-800 sm:ml-2 sm:w-auto">
        {formatWeekRangePt(weekStart)}
      </p>
    </div>
  );
}

function AgendaViewModePills() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-zinc-100/80 p-1 ring-1 ring-zinc-200/60">
      <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-600/20">
        Semana
      </span>
      <span
        className="cursor-not-allowed px-3 py-1.5 text-xs font-medium text-zinc-400"
        title="Visão por dia em breve"
      >
        Dia{" "}
        <span className="ml-1 rounded bg-zinc-200/80 px-1 py-0.5 text-[10px] font-semibold uppercase text-zinc-500">
          breve
        </span>
      </span>
    </div>
  );
}

type AgendaLayoutProps = {
  canSchedule: boolean;
  /** ISO date (yyyy-mm-dd) for “today” from the server */
  todayIso: string;
  /** Segunda-feira da semana visível (yyyy-mm-dd, fuso local). */
  weekMondayIso: string;
  consultas: AgendaConsultaRow[];
};

export function AgendaLayout({
  canSchedule,
  todayIso,
  weekMondayIso,
  consultas,
}: AgendaLayoutProps) {
  const serverToday = useMemo(() => {
    const [y, mo, d] = todayIso.split("-").map(Number);
    return new Date(y, mo - 1, d);
  }, [todayIso]);

  const weekStart = useMemo(
    () => parseLocalDateFromYmd(weekMondayIso),
    [weekMondayIso],
  );

  const currentWeekMondayIso = useMemo(
    () => formatYmdLocal(startOfWeekMonday(serverToday)),
    [serverToday],
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const hours = useMemo(
    () => Array.from({ length: SLOT_COUNT }, (_, i) => i),
    [],
  );

  const todayConsultas = useMemo(
    () =>
      consultas.filter((c) =>
        isSameLocalCalendarDay(new Date(c.scheduledAt), serverToday),
      ),
    [consultas, serverToday],
  );

  const countByStatus = useMemo(() => {
    const m = {
      agendada: 0,
      em_atendimento: 0,
      concluida: 0,
      cancelada: 0,
    } as Record<string, number>;
    for (const c of todayConsultas) {
      m[c.status] = (m[c.status] ?? 0) + 1;
    }
    return m;
  }, [todayConsultas]);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  return (
    <>
      {expanded ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px] transition-opacity"
            aria-label="Fechar vista ampliada"
            onClick={() => setExpanded(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-expanded-title"
            className="relative flex h-[min(92dvh,920px)] w-full max-w-[min(96vw,88rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-2xl shadow-zinc-900/25 ring-1 ring-zinc-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 border-b border-zinc-200/80 bg-gradient-to-b from-emerald-50/90 to-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <h2
                  id="agenda-expanded-title"
                  className="text-lg font-semibold tracking-tight text-zinc-900"
                >
                  Agenda ampliada
                </h2>
                <p className="mt-0.5 text-xs text-zinc-600">
                  Mais área útil e slots maiores — ideal para rever a semana ao
                  detalhe.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                Reduzir vista
              </button>
            </div>

            <div className="border-b border-zinc-100 bg-white px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <AgendaWeekToolbar
                  weekMondayIso={weekMondayIso}
                  currentWeekMondayIso={currentWeekMondayIso}
                />
                <AgendaViewModePills />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-y-contain bg-white p-2 sm:p-4">
              <AgendaTimeGrid
                days={days}
                hours={hours}
                serverToday={serverToday}
                variant="expanded"
                consultas={consultas}
                canSchedule={canSchedule}
                weekMondayIso={weekMondayIso}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
        <main className="mx-auto max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Agenda
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-600 sm:text-base">
                Duplo clique num horário vazio para agendar (receção/admin). Botão
                direito no vazio ou numa consulta abre opções. Amplie para ver a
                semana com mais conforto.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {canSchedule ? (
                <Link
                  href={`/agenda/novo?week=${weekMondayIso}`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Nova consulta
                </Link>
              ) : (
                <p className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-600 ring-1 ring-zinc-900/5">
                  Agendamento pela receção ou administrador.
                </p>
              )}
            </div>
          </header>

          <div className="mt-6 flex flex-col gap-6">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-zinc-900/5 sm:p-4">
                <AgendaWeekToolbar
                  weekMondayIso={weekMondayIso}
                  currentWeekMondayIso={currentWeekMondayIso}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                  <AgendaViewModePills />
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-3 text-sm font-bold tracking-tight text-emerald-950 shadow-md shadow-emerald-900/15 ring-1 ring-emerald-600/20 transition hover:border-emerald-700 hover:from-emerald-100/90 hover:shadow-lg sm:w-auto sm:min-w-[11rem]"
                  >
                    <svg
                      className="size-5 shrink-0 text-emerald-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                      />
                    </svg>
                    Ampliar agenda
                  </button>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
                {/*
                Uma só grelha + um scroll: cabeçalho e horários partilham a
                mesma largura útil (a barra de scroll não desloca só o corpo).
                Linha dos dias com sticky top dentro deste scroll.
              */}
                <div className="min-w-0">
                  <AgendaTimeGrid
                    days={days}
                    hours={hours}
                    serverToday={serverToday}
                    variant="compact"
                    consultas={consultas}
                    canSchedule={canSchedule}
                    weekMondayIso={weekMondayIso}
                  />
                </div>

                <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-4 sm:px-5">
                  <div className="mx-auto max-w-lg text-center">
                    <p className="text-sm font-medium text-zinc-800">
                      {consultas.length === 0
                        ? "Sem consultas nesta semana."
                        : `${consultas.length} consulta${consultas.length === 1 ? "" : "s"} nesta semana.`}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                      {SLOT_START_HOUR}h–{SLOT_END_HOUR}h, slots de {SLOT_MINUTES}{" "}
                      min. Legenda e resumo do dia estão abaixo. «Ampliar agenda»
                      para células maiores.
                      {canSchedule
                        ? " Cancelar: botão direito na consulta (agendada)."
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Resumo do dia
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  Contagem das consultas de hoje ({todayIso}) nesta clínica.
                </p>
                <dl className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-xs text-zinc-500">Agendadas</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-900">
                      {countByStatus.agendada ?? 0}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-xs text-zinc-500">Em sala</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-900">
                      {countByStatus.em_atendimento ?? 0}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-xs text-zinc-500">Concluídas</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-900">
                      {countByStatus.concluida ?? 0}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-dashed border-emerald-300/50 bg-emerald-50/30 p-5 ring-1 ring-emerald-600/10">
                <h2 className="text-sm font-semibold text-emerald-950">
                  Valor comercial
                </h2>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-900/90">
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Receção vê a semana inteira de relance; menos conflitos e
                    telefonemas repetidos.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Veterinário prepara o dia com contexto temporal antes de
                    abrir o pet.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Base para lembretes, confirmação e métricas de ocupação.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Estados (legenda)
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Cores na grelha (MVP).
                </p>
                <ul className="mt-4 space-y-2.5 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-sky-500" />
                    <span className="text-zinc-700">Agendada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="text-zinc-700">Em atendimento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-emerald-600" />
                    <span className="text-zinc-700">Concluída</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-zinc-300" />
                    <span className="text-zinc-700">Cancelada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
