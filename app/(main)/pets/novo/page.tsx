import { NovoPetForm } from "@/components/pets/novo-pet-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NovoPetPage() {
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
    redirect("/pets");
  }

  const { data: tutors } = await supabase
    .from("tutors")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <Link
            href="/pets"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Pets
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Novo pet
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Escolha o tutor e preencha os dados do animal.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5 sm:p-8">
          <NovoPetForm tutors={tutors ?? []} />
        </div>
      </main>
    </div>
  );
}
