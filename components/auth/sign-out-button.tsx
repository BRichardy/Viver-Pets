"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={loading}
      className={`inline-flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 ${className}`}
    >
      {loading ? "A sair…" : "Sair"}
    </button>
  );
}
