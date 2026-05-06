"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateTutorState = {
  error?: string;
  success?: boolean;
};

export async function createTutor(
  _prev: CreateTutorState,
  formData: FormData,
): Promise<CreateTutorState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("clinic_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.clinic_id) {
    return { error: "Perfil não encontrado." };
  }

  if (profile.role !== "admin" && profile.role !== "reception") {
    return {
      error: "Apenas administrador ou receção podem registar tutores.",
    };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const documentId = String(formData.get("document_id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!fullName || !phone) {
    return { error: "Nome e telefone são obrigatórios." };
  }

  const { error: insertError } = await supabase.from("tutors").insert({
    clinic_id: profile.clinic_id,
    full_name: fullName,
    phone,
    email: emailRaw || null,
    document_id: documentId || null,
    notes: notes || null,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/tutores");
  redirect("/tutores");
}
