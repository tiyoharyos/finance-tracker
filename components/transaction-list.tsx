import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/lib/actions";
import { formatDate, formatIDR } from "@/lib/format";
import type { Category, Transaction } from "@/lib/types";
import { TransactionDialog } from "@/components/transaction-dialog";

export function TransactionList({
  transactions,
  categories,
  today,
  editable = true,
}: {
  transactions: Transaction[];
  categories: Category[];
  today: string;
  editable?: boolean;
}) {
  const byId = new Map(categories.map((c) => [c.id, c]));

  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        Belum ada transaksi di periode ini.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white">
      {transactions.map((t) => {
        const cat = t.category_id ? byId.get(t.category_id) : undefined;
        const isIncome = cat?.type === "income";
        return (
          <li key={t.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {t.note || cat?.name || "Tanpa kategori"}
              </p>
              <p className="text-xs text-neutral-500">
                {cat?.name ?? "Tanpa kategori"} · {formatDate(t.transaction_date)}
              </p>
            </div>
            <span
              className={`text-sm font-semibold tabular-nums ${
                isIncome ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isIncome ? "+" : "−"}
              {formatIDR(t.amount)}
            </span>
            {editable && (
              <div className="flex items-center">
                <TransactionDialog
                  categories={categories}
                  transaction={t}
                  defaultDate={today}
                />
                <form action={deleteTransaction.bind(null, t.id)}>
                  <button
                    type="submit"
                    aria-label="Hapus transaksi"
                    className="rounded-md p-1.5 text-neutral-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
