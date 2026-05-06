"use client";

import { createTutor, type CreateTutorState } from "@/app/(main)/tutores/actions";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useActionState } from "react";

export function NovoTutorForm() {
  const initial: CreateTutorState = {};
  const [state, formAction, pending] = useActionState(createTutor, initial);

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
        <label htmlFor="full_name" className={labelClass}>
          Nome completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Ex.: Maria Silva"
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
          autoComplete="tel"
          className={inputClass}
          placeholder="Ex.: 912 345 678"
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
          autoComplete="email"
          className={inputClass}
          placeholder="nome@email.com"
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
          className={`${inputClass} resize-y`}
          placeholder="Observações internas sobre o tutor…"
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
          className={`${primaryButtonClass} sm:w-auto sm:min-w-[140px]`}
        >
          {pending ? "A guardar…" : "Guardar tutor"}
        </button>
      </div>
    </form>
  );
}
