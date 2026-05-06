import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-50">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b from-emerald-200/40 via-emerald-100/20 to-transparent blur-3xl"
        aria-hidden
      />
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl text-white shadow-xl shadow-emerald-600/25">
            🐾
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            ViverPets
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Clínica organizada.
            <span className="block text-emerald-700">Animais no centro.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-zinc-600">
            Base técnica pronta: autenticação, multi-tenant e painel inicial.
            O produto completo vem a seguir.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Criar conta
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-xl px-4 py-3 text-sm font-semibold text-emerald-800 hover:underline"
            >
              Ir para o painel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
