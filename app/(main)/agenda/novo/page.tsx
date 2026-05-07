import { NovaConsultaForm } from "@/components/agenda/nova-consulta-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

function parseWhenParam(when: string | undefined): string | null {
  if (!when) return null;
  const decoded = decodeURIComponent(when.trim());
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(decoded)) return null;
  const d = new Date(decoded);
  if (Number.isNaN(d.getTime())) return null;
  return decoded;
}

function parseWeekParam(week: string | undefined): string | null {
  if (!week) return null;
  const decoded = decodeURIComponent(week.trim());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(decoded)) return null;
  return decoded;
}

function isoToDatetimeLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

type NovaConsultaPageProps = {
  searchParams?: Promise<{ when?: string; week?: string; edit?: string }>;
};

export default async function NovaConsultaPage({
  searchParams,
}: NovaConsultaPageProps) {
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

  if (profile.role !== "admin" && profile.role !== "reception") {
    redirect("/agenda");
  }

  const sp = searchParams ? await searchParams : {};
  const initialWhen = parseWhenParam(sp.when);
  const returnWeek = parseWeekParam(sp.week);
  const editId = String(sp.edit ?? "").trim() || null;

  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("id, name")
    .order("name", { ascending: true });

  const { data: professionals, error: profError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "vet")
    .order("full_name", { ascending: true });

  if (petsError || profError) {
    const err = petsError ?? profError;
    return (
      <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="mt-2 text-sm">{err?.message}</p>
          <Link
            href="/agenda"
            className="mt-4 inline-block text-sm font-semibold text-red-800 underline"
          >
            Voltar à agenda
          </Link>
        </div>
      </div>
    );
  }

  let editConsulta:
    | {
      id: string;
      pet_id: string;
      scheduled_at: string;
      notes: string | null;
      professional_id: string | null;
    }
    | null = null;
  if (editId) {
    const { data } = await supabase
      .from("consultas")
      .select("id, pet_id, scheduled_at, notes, professional_id")
      .eq("id", editId)
      .maybeSingle();
    editConsulta = data ?? null;
  }

  const backHref =
    returnWeek != null ? `/agenda?week=${encodeURIComponent(returnWeek)}` : "/agenda";

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href={backHref}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Agenda
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {editConsulta ? "Editar consulta" : "Nova consulta"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {editConsulta
            ? "Atualize pet, data/hora, profissional e observações."
            : "Escolha o pet, data e hora; o profissional é opcional."}
        </p>
        <div className="mt-8 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
          <NovaConsultaForm
            pets={(pets ?? []).map((p) => ({ id: p.id, name: p.name }))}
            professionals={professionals ?? []}
            initialDatetimeLocal={
              editConsulta
                ? isoToDatetimeLocalInput(editConsulta.scheduled_at)
                : initialWhen
            }
            initialPetId={editConsulta?.pet_id ?? null}
            initialProfessionalId={editConsulta?.professional_id ?? null}
            initialNotes={editConsulta?.notes ?? null}
            consultaId={editConsulta?.id ?? null}
            returnWeek={returnWeek}
          />
        </div>
      </main>
    </div>
  );
}
