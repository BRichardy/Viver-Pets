"use client";

import { createPet, type CreatePetState } from "@/app/(main)/pets/actions";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useActionState } from "react";

export type TutorOption = { id: string; full_name: string };

type NovoPetFormProps = {
  tutors: TutorOption[];
};

export function NovoPetForm({ tutors }: NovoPetFormProps) {
  const initial: CreatePetState = {};
  const [state, formAction, pending] = useActionState(createPet, initial);

  if (tutors.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
        <p>É necessário ter pelo menos um tutor antes de registar um pet.</p>
        <Link
          href="/tutores/novo"
          className="mt-3 inline-block font-semibold text-emerald-800 underline"
        >
          Criar tutor
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
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
          defaultValue=""
        >
          <option value="" disabled>
            Selecione…
          </option>
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
          className={inputClass}
          placeholder="Ex.: Thor"
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
          className={inputClass}
          placeholder="Ex.: Cão, Gato, Coelho…"
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
          className={inputClass}
          placeholder="Ex.: Labrador"
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
          className={inputClass}
          placeholder="Ex.: Macho, Fêmea"
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
          className={`${inputClass} resize-y`}
          placeholder="Observações clínicas ou administrativas…"
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
          className={`${primaryButtonClass} sm:w-auto sm:min-w-[140px]`}
        >
          {pending ? "A guardar…" : "Guardar pet"}
        </button>
      </div>
    </form>
  );
}
