import { createClient } from "@/lib/supabase/server";
import type { Category, Transaction } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getTransactions(
  from: string,
  to: string
): Promise<Transaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, amount, note, transaction_date, category_id")
    .gte("transaction_date", from)
    .lte("transaction_date", to)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  // numeric dari Postgres bisa datang sebagai string, pastikan number
  return (data ?? []).map((t) => ({ ...t, amount: Number(t.amount) }));
}
