import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TutoresPage() {
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

  const canManage =
    profile.role === "admin" || profile.role === "reception";

  const { data: tutors, error } = await supabase
    .from("tutors")
    .select("id, full_name, phone, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <p className="font-medium">Erro ao carregar tutores</p>
          <p className="mt-2 text-sm">{error.message}</p>
          <p className="mt-4 text-sm text-red-800">
            Se acabou de adicionar a migração, execute o SQL em{" "}
            <code className="rounded bg-red-100 px-1">supabase/migrations/20260507120000_tutors.sql</code>{" "}
            no Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Tutores
            </h1>
            <p className="mt-1 text-sm text-zinc-600 sm:text-base">
              Responsáveis pelos animais da clínica.
            </p>
          </div>
          {canManage ? (
            <Link
              href="/tutores/novo"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Novo tutor
            </Link>
          ) : null}
        </div>

        {!canManage ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            O seu papel só permite consultar a lista. Pedidos de alteração à
            receção ou administrador.
          </p>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
          {tutors && tutors.length > 0 ? (
            <ul className="divide-y divide-zinc-100">
              {tutors.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col gap-1 px-5 py-4 transition hover:bg-zinc-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900">{t.full_name}</p>
                    <p className="mt-0.5 text-sm text-zinc-600">
                      {t.phone}
                      {t.email ? (
                        <span className="text-zinc-400"> · {t.email}</span>
                      ) : null}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-zinc-400">
                    {new Date(t.created_at).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
                👤
              </div>
              <p className="text-base font-medium text-zinc-900">
                Ainda não há tutores
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
                Adicione o primeiro responsável para depois associar pets e
                consultas.
              </p>
              {canManage ? (
                <Link
                  href="/tutores/novo"
                  className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Adicionar tutor
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
