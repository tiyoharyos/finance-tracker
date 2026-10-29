import { Suspense } from "react";
import { connection } from "next/server";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { getCategories, getTransactions } from "@/lib/data";
import { formatIDR, resolveMonth } from "@/lib/format";
import { MonthPicker } from "@/components/month-picker";
import { DailyBars, ExpensePie } from "@/components/charts";
import { TransactionList } from "@/components/transaction-list";
import { TransactionDialog } from "@/components/transaction-dialog";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export const metadata = { title: "Dashboard · Finance Tracker" };

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({
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
  const byId = new Map(categories.map((c) => [c.id, c]));

  let income = 0;
  let expense = 0;
  const perCategory = new Map<string, number>();
  const perDay = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const cat = t.category_id ? byId.get(t.category_id) : undefined;
    const isIncome = cat?.type === "income";
    if (isIncome) income += t.amount;
    else {
      expense += t.amount;
      const name = cat?.name ?? "Tanpa kategori";
      perCategory.set(name, (perCategory.get(name) ?? 0) + t.amount);
    }
    const day = t.transaction_date.slice(8);
    const d = perDay.get(day) ?? { income: 0, expense: 0 };
    if (isIncome) d.income += t.amount;
    else d.expense += t.amount;
    perDay.set(day, d);
  }

  const pie = [...perCategory].map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const bars = [...perDay]
    .map(([day, v]) => ({ day, ...v }))
    .sort((a, b) => a.day.localeCompare(b.day));
  const balance = income - expense;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm capitalize text-neutral-500">{month.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker value={month.value} />
          <TransactionDialog categories={categories} defaultDate={today} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Pemasukan" value={income} icon={<ArrowUpCircle className="text-emerald-600" />} />
        <SummaryCard label="Pengeluaran" value={expense} icon={<ArrowDownCircle className="text-rose-600" />} />
        <SummaryCard label="Saldo bulan ini" value={balance} icon={<Wallet className="text-neutral-600" />} negative={balance < 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-medium text-neutral-600">Pengeluaran per kategori</h2>
          <ExpensePie data={pie} />
        </section>
        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-medium text-neutral-600">Arus harian</h2>
          <DailyBars data={bars} />
        </section>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-medium text-neutral-600">Transaksi terbaru</h2>
        <TransactionList
          transactions={transactions.slice(0, 5)}
          categories={categories}
          today={today}
          editable={false}
        />
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  negative,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  negative?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        {label}
        {icon}
      </div>
      <p className={`mt-2 text-xl font-semibold tabular-nums ${negative ? "text-rose-600" : ""}`}>
        {formatIDR(value)}
      </p>
    </div>
  );
}
