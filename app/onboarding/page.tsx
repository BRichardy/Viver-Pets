import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <AuthSplitLayout
      headline="Configure a sua clínica"
      subheadline="Este passo cria o espaço da clínica no sistema e define-o como administrador."
      kicker="Configuração inicial"
    >
      <OnboardingForm />
    </AuthSplitLayout>
  );
}
