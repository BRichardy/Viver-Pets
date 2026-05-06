"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreatePetState = { error?: string };
export type UpdatePetState = { error?: string };

async function assertStaffCanManagePets(): Promise<
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
      error: "Apenas administrador ou receção podem gerir pets.",
    };
  }

  return { ok: true, supabase, profile };
}

export async function createPet(
  _prev: CreatePetState,
  formData: FormData,
): Promise<CreatePetState> {
  const gate = await assertStaffCanManagePets();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
  const tutorId = String(formData.get("tutor_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const dobRaw = String(formData.get("date_of_birth") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!tutorId || !name || !species) {
    return { error: "Tutor, nome e espécie são obrigatórios." };
  }

  const date_of_birth = dobRaw ? dobRaw : null;

  const { error: insertError } = await supabase.from("pets").insert({
    clinic_id: profile.clinic_id,
    tutor_id: tutorId,
    name,
    species,
    breed: breed || null,
    sex: sex || null,
    date_of_birth,
    notes: notes || null,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/pets");
  redirect("/pets");
}

export async function updatePet(
  _prev: UpdatePetState,
  formData: FormData,
): Promise<UpdatePetState> {
  const gate = await assertStaffCanManagePets();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase, profile } = gate;
  const petId = String(formData.get("pet_id") ?? "").trim();
  const tutorId = String(formData.get("tutor_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const sex = String(formData.get("sex") ?? "").trim();
  const dobRaw = String(formData.get("date_of_birth") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!petId) {
    return { error: "Identificador do pet em falta." };
  }
  if (!tutorId || !name || !species) {
    return { error: "Tutor, nome e espécie são obrigatórios." };
  }

  const date_of_birth = dobRaw ? dobRaw : null;

  const { data: existing } = await supabase
    .from("pets")
    .select("clinic_id")
    .eq("id", petId)
    .eq("clinic_id", profile.clinic_id)
    .maybeSingle();

  if (!existing) {
    return { error: "Pet não encontrado." };
  }

  const { error: updateError } = await supabase
    .from("pets")
    .update({
      tutor_id: tutorId,
      name,
      species,
      breed: breed || null,
      sex: sex || null,
      date_of_birth,
      notes: notes || null,
    })
    .eq("id", petId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/pets");
  redirect("/pets");
}

export async function deletePet(petId: string): Promise<{ error?: string }> {
  const gate = await assertStaffCanManagePets();
  if (!gate.ok) {
    return { error: gate.error };
  }

  const { supabase } = gate;
  const id = petId.trim();
  if (!id) {
    return { error: "Identificador inválido." };
  }

  const { error } = await supabase.from("pets").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/pets");
  return {};
}
