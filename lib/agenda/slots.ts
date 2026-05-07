import { formatYmdLocal, isSameLocalCalendarDay } from "@/lib/agenda/week";

export const SLOT_START_HOUR = 8;
export const SLOT_END_HOUR = 19;
export const SLOT_MINUTES = 30;
export const SLOT_COUNT =
  ((SLOT_END_HOUR - SLOT_START_HOUR) * 60) / SLOT_MINUTES;

export function slotLabel(index: number): string {
  const totalMin = SLOT_START_HOUR * 60 + index * SLOT_MINUTES;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Valor para `input[type=datetime-local]` (fuso local do browser). */
export function datetimeLocalValueForSlot(day: Date, slotIndex: number): string {
  const totalMin = SLOT_START_HOUR * 60 + slotIndex * SLOT_MINUTES;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${formatYmdLocal(day)}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type AgendaConsultaRow = {
  id: string;
  scheduledAt: string;
  status: string;
  petId: string;
  petName: string;
  notes: string | null;
};

/** Índice do slot de 30 min (0 = 08:00) ou null se fora da grelha. */
export function slotIndexFromLocalDate(d: Date): number | null {
  const mins = d.getHours() * 60 + d.getMinutes() - SLOT_START_HOUR * 60;
  const idx = Math.floor(mins / SLOT_MINUTES);
  if (idx < 0 || idx >= SLOT_COUNT) return null;
  return idx;
}

/** Agrupa consultas por "dayIndex-slotIndex" (dayIndex 0 = segunda da `weekDays`). */
export function groupConsultasByDaySlot(
  consultas: AgendaConsultaRow[],
  weekDays: Date[],
): Map<string, AgendaConsultaRow[]> {
  const map = new Map<string, AgendaConsultaRow[]>();
  for (const c of consultas) {
    const dt = new Date(c.scheduledAt);
    const dayIndex = weekDays.findIndex((wd) => isSameLocalCalendarDay(wd, dt));
    if (dayIndex < 0) continue;
    const slotIdx = slotIndexFromLocalDate(dt);
    if (slotIdx === null) continue;
    const key = `${dayIndex}-${slotIdx}`;
    const arr = map.get(key) ?? [];
    arr.push(c);
    map.set(key, arr);
  }
  return map;
}
