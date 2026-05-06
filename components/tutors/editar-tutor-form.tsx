"use client";

import {
  updateTutor,
  type UpdateTutorState,
} from "@/app/(main)/tutores/actions";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useActionState } from "react";

export type TutorEditRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  document_id: string | null;
  notes: string | null;
};

type EditarTutorFormProps = {
  tutor: TutorEditRow;
};

export function EditarTutorForm({ tutor }: EditarTutorFormProps) {
  const initial: UpdateTutorState = {};
  const [state, formAction, pending] = useActionState(updateTutor, initial);

  return (
    <form key={tutor.id} action={formAction} className="space-y-5">
      <input type="hidden" name="tutor_id" value={tutor.id} />

      {state.error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="full_name" className={labelClass}>
          Nome completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={tutor.full_name}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={tutor.phone}
          autoComplete="tel"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={tutor.email ?? ""}
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="document_id" className={labelClass}>
          Documento de identificação{" "}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="document_id"
          name="document_id"
          type="text"
          defaultValue={tutor.document_id ?? ""}
          className={inputClass}
          placeholder="CC / BI / outro"
        />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notas <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={tutor.notes ?? ""}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href="/tutores"
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
