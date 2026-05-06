import { MainAppShell } from "@/components/layout/main-app-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  reception: "Receção",
  vet: "Veterinário",
};

export default async function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, clinics ( id, name )")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const rawClinic = profile.clinics;
  const clinic = Array.isArray(rawClinic)
    ? (rawClinic[0] ?? null)
    : (rawClinic as { id: string; name: string } | null);

  const clinicName = clinic?.name ?? "Clínica";
  const roleLabel = roleLabels[profile.role] ?? profile.role;

  return (
    <MainAppShell
      clinicName={clinicName}
      userEmail={user.email ?? ""}
      roleLabel={roleLabel}
    >
      {children}
    </MainAppShell>
  );
}
