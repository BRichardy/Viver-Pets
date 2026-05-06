"use client";

import {
  updatePet,
  type UpdatePetState,
} from "@/app/(main)/pets/actions";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useActionState } from "react";

import type { TutorOption } from "./novo-pet-form";

export type PetEditRow = {
  id: string;
  tutor_id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  date_of_birth: string | null;
  notes: string | null;
};

type EditarPetFormProps = {
  pet: PetEditRow;
  tutors: TutorOption[];
};

export function EditarPetForm({ pet, tutors }: EditarPetFormProps) {
  const initial: UpdatePetState = {};
  const [state, formAction, pending] = useActionState(updatePet, initial);

  const dob =
    pet.date_of_birth && pet.date_of_birth.length >= 10
      ? pet.date_of_birth.slice(0, 10)
      : "";

  return (
    <form key={pet.id} action={formAction} className="space-y-5">
      <input type="hidden" name="pet_id" value={pet.id} />

      {state.error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="tutor_id" className={labelClass}>
          Tutor responsável
        </label>
        <select
          id="tutor_id"
          name="tutor_id"
          required
          className={inputClass}
          defaultValue={pet.tutor_id}
        >
          {tutors.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Nome do pet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={pet.name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="species" className={labelClass}>
          Espécie
        </label>
        <input
          id="species"
          name="species"
          type="text"
          required
          defaultValue={pet.species}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="breed" className={labelClass}>
          Raça <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="breed"
          name="breed"
          type="text"
          defaultValue={pet.breed ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="sex" className={labelClass}>
          Sexo <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="sex"
          name="sex"
          type="text"
          defaultValue={pet.sex ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="date_of_birth" className={labelClass}>
          Data de nascimento{" "}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          defaultValue={dob}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notas / alergias{" "}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={pet.notes ?? ""}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href="/pets"
          className="inline-flex justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className={`${primaryButtonClass} sm:w-auto sm:min-w-[160px]`}
        >
          {pending ? "A guardar…" : "Guardar alterações"}
        </button>
      </div>
    </form>
  );
}
