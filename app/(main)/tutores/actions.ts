"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateTutorState = {
  error?: string;
  success?: boolean;
};

export type UpdateTutorState = {
  error?: string;
};

async function assertCanManageTutors(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; profile: { clinic_id: string; role: string } }
  | { ok: false; error: string }
> {
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
    return { ok: false, error: "Perfil não encontrado." };
  }

  if (profile.role !== "admin" && profile.role !== "reception") {
    return {
      ok: false,
      error: "Apenas administrador ou receção podem gerir tutores.",
    };
  }

  return { ok: true, supabase, profile };
}

export async function createTutor(
  _prev: CreateTutorState,
  formData: FormData,
): Promise<CreateTutorState> {
  const gate = await assertCanManageTutors();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
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

export async function updateTutor(
  _prev: UpdateTutorState,
  formData: FormData,
): Promise<UpdateTutorState> {
  const gate = await assertCanManageTutors();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase } = gate;
  const tutorId = String(formData.get("tutor_id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const documentId = String(formData.get("document_id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!tutorId) {
    return { error: "Identificador do tutor em falta." };
  }

  if (!fullName || !phone) {
    return { error: "Nome e telefone são obrigatórios." };
  }

  const { error: updateError } = await supabase
    .from("tutors")
    .update({
      full_name: fullName,
      phone,
      email: emailRaw || null,
      document_id: documentId || null,
      notes: notes || null,
    })
    .eq("id", tutorId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/tutores");
  redirect("/tutores");
}

export async function deleteTutor(
  tutorId: string,
): Promise<{ error?: string }> {
  const gate = await assertCanManageTutors();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase } = gate;
  const id = tutorId.trim();
  if (!id) {
    return { error: "Identificador inválido." };
  }

  const { error } = await supabase.from("tutors").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tutores");
  return {};
}
