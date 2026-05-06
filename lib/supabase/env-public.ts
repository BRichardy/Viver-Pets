/**
 * Variáveis públicas do Supabase (browser + servidor Next).
 * Suporta chave legada `anon` e chave nova `publishable` do dashboard.
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL está vazia. Adicione-a a .env.local e reinicie `npm run dev`.",
    );
  }
  return raw.replace(/\/+$/, "");
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!key) {
    throw new Error(
      "Chave pública do Supabase em falta. Use NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY em .env.local e reinicie o servidor de desenvolvimento.",
    );
  }
  return key;
}
