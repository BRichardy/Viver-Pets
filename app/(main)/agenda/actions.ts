"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateConsultaState = { error?: string };

async function assertStaffCanManageConsultas(): Promise<
  | {
    ok: true;
    supabase: Awaited<ReturnType<typeof createClient>>;
    profile: { clinic_id: string };
  }
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
      error: "Apenas administrador ou receção podem agendar consultas.",
    };
  }

  return { ok: true, supabase, profile };
}

export async function createConsulta(
  _prev: CreateConsultaState,
  formData: FormData,
): Promise<CreateConsultaState> {
  const gate = await assertStaffCanManageConsultas();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
  const petId = String(formData.get("pet_id") ?? "").trim();
  const scheduledIso = String(formData.get("scheduled_at_iso") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const professionalRaw = String(
    formData.get("professional_id") ?? "",
  ).trim();
  const professional_id = professionalRaw || null;

  if (!petId || !scheduledIso) {
    return { error: "Pet e data/hora são obrigatórios." };
  }

  const at = new Date(scheduledIso);
  if (Number.isNaN(at.getTime())) {
    return { error: "Data/hora inválida." };
  }

  const { error: insertError } = await supabase.from("consultas").insert({
    clinic_id: profile.clinic_id,
    pet_id: petId,
    scheduled_at: at.toISOString(),
    status: "agendada",
    professional_id,
    notes: notes || null,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function upsertConsulta(
  _prev: CreateConsultaState,
  formData: FormData,
): Promise<CreateConsultaState> {
  const consultaId = String(formData.get("consulta_id") ?? "").trim();
  if (!consultaId) {
    return createConsulta(_prev, formData);
  }

  const gate = await assertStaffCanManageConsultas();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
  const petId = String(formData.get("pet_id") ?? "").trim();
  const scheduledIso = String(formData.get("scheduled_at_iso") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const professionalRaw = String(
    formData.get("professional_id") ?? "",
  ).trim();
  const professional_id = professionalRaw || null;

  if (!petId || !scheduledIso) {
    return { error: "Pet e data/hora são obrigatórios." };
  }

  const at = new Date(scheduledIso);
  if (Number.isNaN(at.getTime())) {
    return { error: "Data/hora inválida." };
  }

  const { data: existing } = await supabase
    .from("consultas")
    .select("id, clinic_id")
    .eq("id", consultaId)
    .maybeSingle();

  if (!existing || existing.clinic_id !== profile.clinic_id) {
    return { error: "Consulta não encontrada." };
  }

  const { error } = await supabase
    .from("consultas")
    .update({
      pet_id: petId,
      scheduled_at: at.toISOString(),
      professional_id,
      notes: notes || null,
      status: "agendada",
    })
    .eq("id", consultaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function cancelConsulta(
  consultaId: string,
): Promise<{ error?: string }> {
  const gate = await assertStaffCanManageConsultas();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
  const id = consultaId.trim();
  if (!id) {
    return { error: "Identificador inválido." };
  }

  const { data: row } = await supabase
    .from("consultas")
    .select("id, clinic_id")
    .eq("id", id)
    .maybeSingle();

  if (!row || row.clinic_id !== profile.clinic_id) {
    return { error: "Consulta não encontrada." };
  }

  const { error } = await supabase
    .from("consultas")
    .update({ status: "cancelada" })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/agenda");
  return {};
}
