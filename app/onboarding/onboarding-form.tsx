"use client";

import { createClient } from "@/lib/supabase/client";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OnboardingForm() {
  const router = useRouter();
  const [clinicName, setClinicName] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let supabase;
    try {
      supabase = createClient();
    } catch (configErr) {
      setLoading(false);
      setError(
        configErr instanceof Error
          ? configErr.message
          : "Configuração do Supabase em falta.",
      );
      return;
    }

    try {
      const { error: rpcError } = await supabase.rpc(
        "bootstrap_clinic_and_profile",
        {
          p_clinic_name: clinicName.trim(),
          p_full_name: fullName.trim() || null,
        },
      );

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const isNetwork =
        err instanceof TypeError ||
        (err instanceof Error && err.message === "Failed to fetch");
      setError(
        isNetwork
          ? "Rede: confirme URL e chave do Supabase no .env.local e reinicie o servidor."
          : err instanceof Error
            ? err.message
            : "Erro ao guardar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cardClass}>
      <div className="border-b border-zinc-100 pb-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Dados da clínica
        </h2>
        <p className="mt-1.5 text-sm text-zinc-600">
          Pode alterar o nome e a identidade visual mais tarde.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-5">
        {error ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="clinic_name" className={labelClass}>
            Nome da clínica
          </label>
          <input
            id="clinic_name"
            name="clinic_name"
            type="text"
            required
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className={inputClass}
            placeholder="Ex.: Clínica Veterinária Central"
          />
        </div>

        <div>
          <label htmlFor="full_name" className={labelClass}>
            O seu nome <span className="font-normal text-zinc-500">(opcional)</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Como aparece na equipa"
          />
        </div>

        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "A guardar…" : "Concluir e abrir o painel"}
        </button>
      </form>
    </div>
  );
}
