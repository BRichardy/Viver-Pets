"use client";

import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { createClient } from "@/lib/supabase/client";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/form-styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const origin = window.location.origin;

    try {
      const { data, error: signError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (signError) {
        setError(signError.message);
        return;
      }

      if (data.session) {
        router.refresh();
        router.push("/dashboard");
        return;
      }

      setSuccess(true);
    } catch (err) {
      const isNetwork =
        err instanceof TypeError ||
        (err instanceof Error && err.message === "Failed to fetch");
      setError(
        isNetwork
          ? "Não foi possível contactar o Supabase. Verifique URL e chave no .env.local e reinicie `npm run dev`."
          : err instanceof Error
            ? err.message
            : "Erro ao registar.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthSplitLayout
        headline="Quase pronto"
        subheadline="Só falta confirmar o email para ativar a conta e começar a configurar a sua clínica."
        kicker="Confirmação"
      >
        <div className={`${cardClass} text-center`}>
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
            ✉️
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">
            Verifique o email
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Enviamos um link de confirmação. Depois de abrir o link, pode{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              entrar aqui
            </Link>
            .
          </p>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      headline="Crie a sua conta"
      subheadline="O primeiro utilizador torna-se administrador e pode depois convidar a equipa da clínica."
      kicker="Novo registo"
    >
      <div className={cardClass}>
        <div className="border-b border-zinc-100 pb-6">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Dados de acesso
          </h2>
          <p className="mt-1.5 text-sm text-zinc-600">
            Utilizados para entrar no ViverPets.
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
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="nome@clinica.pt"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Palavra-passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-zinc-500">Mínimo 6 caracteres.</p>
          </div>

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? "A registar…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Entrar
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
