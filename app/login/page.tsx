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
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "auth" ? "Sessão inválida. Tente entrar de novo." : null,
  );
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
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signError) {
        setError(signError.message);
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
          ? "Não foi possível contactar o Supabase. Confirme .env.local e reinicie `npm run dev`."
          : err instanceof Error
            ? err.message
            : "Erro ao entrar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cardClass}>
      <div className="border-b border-zinc-100 pb-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Entrar
        </h2>
        <p className="mt-1.5 text-sm text-zinc-600">
          Utilize o email e a palavra-passe da sua conta.
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-600">
        Ainda sem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}

function LoginFallback() {
  return (
    <div
      className={`${cardClass} flex min-h-[320px] items-center justify-center text-sm text-zinc-500`}
    >
      A carregar…
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthSplitLayout
      headline="Bem-vindo de volta"
      subheadline="Aceda ao painel da sua clínica e acompanhe tutores, consultas e o histórico dos animais num só lugar."
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
