export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16">
      <main className="w-full max-w-lg text-center">
        <p className="text-sm font-medium text-emerald-700">ViverPets</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Base do painel pronta
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          Next.js, React, Tailwind e cliente Supabase (SSR) na raiz do repositório.
          Configure o Supabase em{" "}
          <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm text-zinc-800">
            .env.local
          </code>{" "}
          a partir de{" "}
          <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm text-zinc-800">
            .env.example
          </code>
          .
        </p>
      </main>
    </div>
  );
}
