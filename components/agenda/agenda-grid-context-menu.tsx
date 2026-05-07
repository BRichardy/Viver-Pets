"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type AgendaGridMenuItem = {
  id: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onSelect: () => void;
};

type AgendaGridContextMenuProps = {
  x: number;
  y: number;
  items: AgendaGridMenuItem[];
  onClose: () => void;
};

export function AgendaGridContextMenu({
  x,
  y,
  items,
  onClose,
}: AgendaGridContextMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState({ x, y });

  const onCloseStable = useCallback(() => {
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let nx = x;
    let ny = y;
    const pad = 8;
    if (nx + r.width > window.innerWidth - pad) {
      nx = Math.max(pad, window.innerWidth - r.width - pad);
    }
    if (ny + r.height > window.innerHeight - pad) {
      ny = Math.max(pad, window.innerHeight - r.height - pad);
    }
    setAdjusted({ x: nx, y: ny });
  }, [x, y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseStable();
    };
    window.addEventListener("keydown", onKey);
    let removePointer: (() => void) | undefined;
    const tid = window.setTimeout(() => {
      const onPointerDown = (e: PointerEvent) => {
        const n = e.target as Node | null;
        if (n && rootRef.current?.contains(n)) return;
        onCloseStable();
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      removePointer = () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(tid);
      removePointer?.();
    };
  }, [onCloseStable]);

  return (
    <div
      ref={rootRef}
      role="menu"
      className="fixed z-[200] min-w-[12rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-xl shadow-zinc-900/15 ring-1 ring-zinc-900/10"
      style={{ left: adjusted.x, top: adjusted.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="menuitem"
          disabled={it.disabled}
          onClick={() => {
            if (it.disabled) return;
            it.onSelect();
            onCloseStable();
          }}
          className={`flex w-full items-center px-3 py-2 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${it.danger
              ? "text-red-700 hover:bg-red-50"
              : "text-zinc-800 hover:bg-zinc-50"
            }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
