"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid"),
  category_id: z.string().uuid().nullable(),
  note: z.string().max(200, "Catatan maksimal 200 karakter").nullable(),
});

function parseTransaction(formData: FormData) {
  return transactionSchema.safeParse({
    amount: formData.get("amount"),
    transaction_date: formData.get("transaction_date"),
    category_id: String(formData.get("category_id") || "") || null,
    note: String(formData.get("note") || "").trim() || null,
  });
}

function refresh() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

export async function createTransaction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseTransaction(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  // user_id terisi otomatis lewat default auth.uid()
  const { error } = await supabase.from("transactions").insert(parsed.data);
  if (error) return { error: error.message };

  refresh();
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseTransaction(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { error: error.message };

  refresh();
  return { ok: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  refresh();
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(40, "Maksimal 40 karakter"),
  type: z.enum(["income", "expense"]),
});

export async function createCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/transactions");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

const DEFAULT_CATEGORIES = [
  { name: "Gaji", type: "income" },
  { name: "Bonus", type: "income" },
  { name: "Lainnya (masuk)", type: "income" },
  { name: "Makan & Minum", type: "expense" },
  { name: "Transportasi", type: "expense" },
  { name: "Belanja", type: "expense" },
  { name: "Tagihan", type: "expense" },
  { name: "Hiburan", type: "expense" },
  { name: "Kesehatan", type: "expense" },
  { name: "Lainnya (keluar)", type: "expense" },
] as const;

export async function seedDefaultCategories() {
  const supabase = await createClient();
  await supabase.from("categories").insert(DEFAULT_CATEGORIES);
  revalidatePath("/categories");
  revalidatePath("/transactions");
}
