"use client";

import { deletePet } from "@/app/(main)/pets/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DeletePetButtonProps = {
  petId: string;
  petName: string;
};

export function DeletePetButton({ petId, petName }: DeletePetButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    const ok = window.confirm(
      `Excluir o pet "${petName}"? Esta ação não pode ser desfeita.`,
    );
    if (!ok) return;

    setMessage(null);
    startTransition(async () => {
      const result = await deletePet(petId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "A excluir…" : "Excluir"}
      </button>
      {message ? (
        <p className="max-w-[220px] text-right text-xs text-red-600">{message}</p>
      ) : null}
    </div>
  );
}
