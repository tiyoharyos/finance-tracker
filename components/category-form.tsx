"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory } from "@/lib/actions";
import type { ActionState } from "@/lib/types";

export function CategoryForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createCategory, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap gap-2">
      <input
        name="name"
        required
        maxLength={40}
        placeholder="Nama kategori"
        className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
      />
      <select
        name="type"
        defaultValue="expense"
        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
      >
        <option value="expense">Pengeluaran</option>
        <option value="income">Pemasukan</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        Tambah
      </button>
      {state?.error && (
        <p role="alert" className="w-full text-sm text-rose-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
