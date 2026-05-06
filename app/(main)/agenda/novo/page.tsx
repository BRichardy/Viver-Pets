import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NovaConsultaPlaceholderPage() {
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

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-100 to-zinc-50">
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/agenda"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Agenda
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Nova consulta
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          O layout da agenda está pronto; o formulário de agendamento e o
          modelo de dados vêm no passo seguinte (fase G do backlog).
        </p>
        <div className="mt-8 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5">
          <p className="text-sm text-zinc-700">
            Aqui entrará a escolha de pet, data e hora, profissional opcional e
            estado inicial da consulta, com validações e RLS por clínica.
          </p>
        </div>
      </main>
    </div>
  );
}
