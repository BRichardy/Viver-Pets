import { AgendaLayout } from "@/components/agenda/agenda-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function todayIsoInLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function AgendaPage() {
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

  return (
    <AgendaLayout canSchedule={canSchedule} todayIso={todayIso} />
  );
}
