import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseAnonKey, getSupabaseUrl } from "./env-public";

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
