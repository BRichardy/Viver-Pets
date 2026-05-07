"use client";

import {
  upsertConsulta,
  type CreateConsultaState,
} from "@/app/(main)/agenda/actions";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

export type PetOption = { id: string; name: string };

type NovaConsultaFormProps = {
  pets: PetOption[];
  professionals: { id: string; full_name: string | null }[];
  initialDatetimeLocal?: string | null;
  initialPetId?: string | null;
  initialProfessionalId?: string | null;
  initialNotes?: string | null;
  consultaId?: string | null;
  returnWeek?: string | null;
};

export function NovaConsultaForm({
  pets,
  professionals,
  initialDatetimeLocal,
  initialPetId,
  initialProfessionalId,
  initialNotes,
  consultaId,
  returnWeek,
}: NovaConsultaFormProps) {
  const initial: CreateConsultaState = {};
  const [state, formAction, pending] = useActionState(upsertConsulta, initial);
  const isoRef = useRef<HTMLInputElement>(null);

  if (pets.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
        <p>É necessário ter pelo menos um pet antes de agendar uma consulta.</p>
        <Link
          href="/pets/novo"
          className="mt-3 inline-block font-semibold text-emerald-800 underline"
        >
          Novo pet
        </Link>
      </div>
    );
  }

  function syncIsoFromLocalValue(value: string) {
    if (!value || !isoRef.current) return;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      isoRef.current.value = d.toISOString();
    }
  }

  function syncIsoFromLocal(e: React.ChangeEvent<HTMLInputElement>) {
    syncIsoFromLocalValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const local = form.elements.namedItem(
      "scheduled_local",
    ) as HTMLInputElement | null;
    if (local?.value) {
      syncIsoFromLocalValue(local.value);
    }
  }

  useEffect(() => {
    if (!initialDatetimeLocal) return;
    syncIsoFromLocalValue(initialDatetimeLocal);
  }, [initialDatetimeLocal]);

  const backHref =
    returnWeek != null
      ? `/agenda?week=${encodeURIComponent(returnWeek)}`
      : "/agenda";

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="consulta_id" value={consultaId ?? ""} />
      <input
        ref={isoRef}
        type="hidden"
        name="scheduled_at_iso"
        defaultValue=""
      />

      {state.error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="pet_id" className={labelClass}>
          Pet
        </label>
        <select
          id="pet_id"
          name="pet_id"
          required
          className={inputClass}
          defaultValue={initialPetId ?? ""}
        >
          <option value="" disabled>
            Selecione…
          </option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="scheduled_local" className={labelClass}>
          Data e hora
        </label>
        <input
          id="scheduled_local"
          name="scheduled_local"
          type="datetime-local"
          required
          className={inputClass}
          defaultValue={initialDatetimeLocal ?? ""}
          onChange={syncIsoFromLocal}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Horário no relógio do seu dispositivo.
        </p>
      </div>

      {professionals.length > 0 ? (
        <div>
          <label htmlFor="professional_id" className={labelClass}>
            Profissional{" "}
            <span className="font-normal text-zinc-500">(opcional)</span>
          </label>
          <select
            id="professional_id"
            name="professional_id"
            className={inputClass}
            defaultValue={initialProfessionalId ?? ""}
          >
            <option value="">—</option>
            {professionals.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.full_name ?? pr.id}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notas <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Observações internas…"
          defaultValue={initialNotes ?? ""}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href={backHref}
          className="inline-flex justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Voltar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className={`${primaryButtonClass} sm:w-auto sm:min-w-[160px]`}
        >
          {pending ? "A guardar…" : consultaId ? "Guardar alterações" : "Agendar"}
        </button>
      </div>
    </form>
  );
}
