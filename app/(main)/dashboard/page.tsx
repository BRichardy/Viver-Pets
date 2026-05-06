import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  reception: "Receção",
  vet: "Veterinário",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, clinic_id, clinics ( id, name )")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const rawClinic = profile.clinics;
  const clinic = Array.isArray(rawClinic)
    ? (rawClinic[0] ?? null)
    : (rawClinic as { id: string; name: string } | null);

  const roleLabel = roleLabels[profile.role] ?? profile.role;

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Painel
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 sm:text-base">
              Resumo da sua conta e da clínica. Em breve: tutores, pets e
              consultas.
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/15">
            {roleLabel}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5 sm:p-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Conta e clínica
            </h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50/80 p-4 ring-1 ring-zinc-200/60">
                <dt className="text-xs font-medium text-zinc-500">Clínica</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">
                  {clinic?.name ?? "—"}
                </dd>
              </div>
              <div className="rounded-2xl bg-zinc-50/80 p-4 ring-1 ring-zinc-200/60">
                <dt className="text-xs font-medium text-zinc-500">Email</dt>
                <dd className="mt-1 break-all text-sm font-medium text-zinc-900">
                  {user.email}
                </dd>
              </div>
              <div className="rounded-2xl bg-zinc-50/80 p-4 ring-1 ring-zinc-200/60">
                <dt className="text-xs font-medium text-zinc-500">Papel</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">
                  {roleLabel}
                </dd>
              </div>
              <div className="rounded-2xl bg-zinc-50/80 p-4 ring-1 ring-zinc-200/60">
                <dt className="text-xs font-medium text-zinc-500">Nome</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">
                  {profile.full_name ?? (
                    <span className="font-normal text-zinc-400">
                      Não definido
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-dashed border-emerald-300/60 bg-emerald-50/40 p-6 ring-1 ring-emerald-600/10">
              <h2 className="text-sm font-semibold text-emerald-900">
                Próximos passos
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-emerald-900/85">
                <li className="flex gap-2">
                  <span className="text-emerald-600">○</span>
                  Cadastrar tutores e pets
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">○</span>
                  Agenda e consultas
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">○</span>
                  Timeline e histórico
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              ← Página inicial
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
