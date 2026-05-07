import { AgendaLayout } from "@/components/agenda/agenda-layout";
import type { AgendaConsultaRow } from "@/lib/agenda/slots";
import {
  parseWeekMondayParam,
  weekRangeUtcIso,
} from "@/lib/agenda/week";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function todayIsoInLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type ConsultaListRow = {
  id: string;
  scheduled_at: string;
  status: string;
  pet_id: string;
  notes: string | null;
  pets: { name: string } | { name: string }[] | null;
};

function petNameFromConsultaRow(r: ConsultaListRow): string {
  const raw = r.pets;
  if (!raw) return "Pet";
  const p = Array.isArray(raw) ? raw[0] : raw;
  return p?.name ?? "Pet";
}

type AgendaPageProps = {
  searchParams?: Promise<{ week?: string }>;
};

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const canSchedule =
    profile.role === "admin" || profile.role === "reception";

  const todayIso = todayIsoInLocalDate(new Date());
  const sp = searchParams ? await searchParams : {};
  const weekMondayIso = parseWeekMondayParam(sp.week, new Date());
  const { startIso, endIso } = weekRangeUtcIso(weekMondayIso);

  const { data: consultasRaw, error: consultasError } = await supabase
    .from("consultas")
    .select("id, scheduled_at, status, pet_id, notes, pets ( name )")
    .gte("scheduled_at", startIso)
    .lt("scheduled_at", endIso)
    .order("scheduled_at", { ascending: true });

  if (consultasError) {
    return (
      <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <p className="font-medium">Erro ao carregar consultas</p>
          <p className="mt-2 text-sm">{consultasError.message}</p>
          <p className="mt-4 text-sm text-red-800">
            Execute a migração em{" "}
            <code className="rounded bg-red-100 px-1">
              supabase/migrations/20260509120000_consultas.sql
            </code>{" "}
            no Supabase (SQL Editor).
          </p>
        </div>
      </div>
    );
  }

  const rows = (consultasRaw ?? []) as ConsultaListRow[];
  const consultas: AgendaConsultaRow[] = rows.map((r) => ({
    id: r.id,
    scheduledAt: r.scheduled_at,
    status: r.status,
    petId: r.pet_id,
    petName: petNameFromConsultaRow(r),
    notes: r.notes,
  }));

  return (
    <AgendaLayout
      canSchedule={canSchedule}
      todayIso={todayIso}
      weekMondayIso={weekMondayIso}
      consultas={consultas}
    />
  );
}
