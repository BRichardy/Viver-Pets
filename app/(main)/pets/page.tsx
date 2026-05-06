import { DeletePetButton } from "@/components/pets/delete-pet-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type PetRow = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  date_of_birth: string | null;
  created_at: string;
  tutor_id: string;
  tutors: { full_name: string } | { full_name: string }[] | null;
};

export default async function PetsPage() {
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

  const { data: pets, error } = await supabase
    .from("pets")
    .select(
      "id, name, species, breed, sex, date_of_birth, created_at, tutor_id, tutors ( full_name )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <p className="font-medium">Erro ao carregar pets</p>
          <p className="mt-2 text-sm">{error.message}</p>
          <p className="mt-4 text-sm text-red-800">
            Execute a migração em{" "}
            <code className="rounded bg-red-100 px-1">
              supabase/migrations/20260508120000_pets.sql
            </code>{" "}
            no Supabase (SQL Editor).
          </p>
        </div>
      </div>
    );
  }

  const list = (pets ?? []) as PetRow[];

  function tutorName(p: PetRow): string {
    const raw = p.tutors;
    if (!raw) return "—";
    const t = Array.isArray(raw) ? raw[0] : raw;
    return t?.full_name ?? "—";
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Pets
            </h1>
            <p className="mt-1 text-sm text-zinc-600 sm:text-base">
              Animais registados na clínica, associados a um tutor.
            </p>
          </div>
          {canManage ? (
            <Link
              href="/pets/novo"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Novo pet
            </Link>
          ) : null}
        </div>

        {!canManage ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            O seu papel só permite consultar a lista. Alterações pela receção ou
            administrador.
          </p>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
          {list.length > 0 ? (
            <ul className="divide-y divide-zinc-100">
              {list.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-zinc-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-900">{p.name}</p>
                    <p className="mt-0.5 text-sm text-zinc-600">
                      {p.species}
                      {p.breed ? (
                        <span className="text-zinc-400"> · {p.breed}</span>
                      ) : null}
                      {p.sex ? (
                        <span className="text-zinc-400"> · {p.sex}</span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Tutor: {tutorName(p)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <p className="text-xs text-zinc-400 sm:text-right">
                      {new Date(p.created_at).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {canManage ? (
                      <div className="flex items-center gap-1 border-t border-zinc-100 pt-2 sm:border-0 sm:pt-0">
                        <Link
                          href={`/pets/${p.id}/editar`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                        >
                          Editar
                        </Link>
                        <span className="text-zinc-200" aria-hidden>
                          |
                        </span>
                        <DeletePetButton petId={p.id} petName={p.name} />
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
                🐕
              </div>
              <p className="text-base font-medium text-zinc-900">
                Ainda não há pets
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
                Registe animais e associe-os a um tutor para consultas e
                histórico.
              </p>
              {canManage ? (
                <Link
                  href="/pets/novo"
                  className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Adicionar pet
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
