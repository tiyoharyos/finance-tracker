import { Suspense } from "react";
import { connection } from "next/server";
import { format } from "date-fns";
import { getCategories, getTransactions } from "@/lib/data";
import { resolveMonth } from "@/lib/format";
import { MonthPicker } from "@/components/month-picker";
import { TransactionList } from "@/components/transaction-list";
import { TransactionDialog } from "@/components/transaction-dialog";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export const metadata = { title: "Transaksi · Finance Tracker" };

export default function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TransactionsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TransactionsContent({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await connection(); // Hitung tanggal dan bulan saat request, bukan saat prerender.
  const { month: monthParam } = await searchParams;
  const month = resolveMonth(monthParam);
  const [transactions, categories] = await Promise.all([
    getTransactions(month.from, month.to),
    getCategories(),
  ]);
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Transaksi</h1>
        <div className="flex items-center gap-2">
          <MonthPicker value={month.value} />
          <TransactionDialog categories={categories} defaultDate={today} />
        </div>
      </div>
      <TransactionList transactions={transactions} categories={categories} today={today} />
    </div>
  );
}
