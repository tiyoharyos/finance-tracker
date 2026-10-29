"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { createTransaction, updateTransaction } from "@/lib/actions";
import type { ActionState, Category, CategoryType, Transaction } from "@/lib/types";

type Props = {
  categories: Category[];
  transaction?: Transaction; // jika ada => mode edit
  defaultDate: string;
};

export function TransactionDialog({ categories, transaction, defaultDate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEdit = !!transaction;
  const initialType: CategoryType =
    categories.find((c) => c.id === transaction?.category_id)?.type ?? "expense";
  const [type, setType] = useState<CategoryType>(initialType);

  const [state, action, pending] = useActionState<ActionState, FormData>(
    isEdit ? updateTransaction.bind(null, transaction.id) : createTransaction,
    undefined
  );

  useEffect(() => {
    if (state?.ok) dialogRef.current?.close();
  }, [state]);

  const options = categories.filter((c) => c.type === type);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={isEdit ? "Ubah transaksi" : "Tambah transaksi"}
        className={
          isEdit
            ? "rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
            : "flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        }
      >
        {isEdit ? <Pencil size={15} /> : <><Plus size={16} /> Tambah</>}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 backdrop:bg-black/40"
      >
        <form
          // key memaksa form reset setelah berhasil menambah
          key={state?.ok ? "ok" : "form"}
          action={action}
          className="space-y-4 p-6"
        >
          <h2 className="text-lg font-semibold">
            {isEdit ? "Ubah transaksi" : "Tambah transaksi"}
          </h2>

          <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-1 text-sm">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-md py-1.5 font-medium transition ${
                  type === t
                    ? t === "income"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "bg-white text-rose-600 shadow-sm"
                    : "text-neutral-500"
                }`}
              >
                {t === "income" ? "Pemasukan" : "Pengeluaran"}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium">
            Nominal (Rp)
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              min="1"
              step="any"
              required
              defaultValue={transaction?.amount}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-emerald-600"
            />
          </label>

          <label className="block text-sm font-medium">
            Kategori
            <select
              name="category_id"
              defaultValue={transaction?.category_id ?? ""}
              key={type}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-emerald-600"
            >
              <option value="">Tanpa kategori</option>
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Tanggal
            <input
              name="transaction_date"
              type="date"
              required
              defaultValue={transaction?.transaction_date ?? defaultDate}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-emerald-600"
            />
          </label>

          <label className="block text-sm font-medium">
            Catatan
            <input
              name="note"
              type="text"
              maxLength={200}
              defaultValue={transaction?.note ?? ""}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-emerald-600"
            />
          </label>

          {state?.error && (
            <p role="alert" className="text-sm text-rose-600">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
