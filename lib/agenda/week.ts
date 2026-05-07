/** Segunda-feira (00:00 local) da semana que contém `from`. */
export function startOfWeekMonday(from: Date): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function formatYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** `week` query: YYYY-MM-DD (qualquer dia); devolve sempre a segunda dessa semana (local). */
export function parseWeekMondayParam(
  weekParam: string | undefined,
  anchor: Date,
): string {
  if (!weekParam || !/^\d{4}-\d{2}-\d{2}$/.test(weekParam)) {
    return formatYmdLocal(startOfWeekMonday(anchor));
  }
  const [y, m, d] = weekParam.split("-").map(Number);
  const any = new Date(y, m - 1, d, 12, 0, 0, 0);
  if (Number.isNaN(any.getTime())) {
    return formatYmdLocal(startOfWeekMonday(anchor));
  }
  return formatYmdLocal(startOfWeekMonday(any));
}

export function shiftWeekMondayIso(weekMondayYmd: string, deltaWeeks: number): string {
  const [y, m, d] = weekMondayYmd.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  dt.setDate(dt.getDate() + deltaWeeks * 7);
  return formatYmdLocal(dt);
}

/** Intervalo [start, end) em ISO UTC para filtrar `scheduled_at` na BD. */
export function weekRangeUtcIso(weekMondayYmd: string): {
  startIso: string;
  endIso: string;
} {
  const [y, m, d] = weekMondayYmd.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d + 7, 0, 0, 0, 0);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export function isSameLocalCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function parseLocalDateFromYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function formatWeekRangePt(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  const y =
    weekStart.getFullYear() !== weekEnd.getFullYear()
      ? { year: "numeric" as const }
      : {};
  const start = new Intl.DateTimeFormat("pt-PT", {
    ...opts,
    ...y,
  }).format(weekStart);
  const end = new Intl.DateTimeFormat("pt-PT", {
    ...opts,
    year: "numeric",
  }).format(weekEnd);
  return `${start} – ${end}`;
}
