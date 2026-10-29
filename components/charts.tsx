"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatIDR } from "@/lib/format";

const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#6366f1", "#06b6d4", "#a855f7", "#84cc16", "#64748b"];

export function ExpensePie({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <EmptyChart text="Belum ada pengeluaran." />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatIDR(Number(v))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyBars({
  data,
}: {
  data: { day: string; income: number; expense: number }[];
}) {
  if (data.length === 0) return <EmptyChart text="Belum ada transaksi." />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" fontSize={12} tickLine={false} />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v >= 1_000_000 ? `${v / 1_000_000}jt` : v >= 1000 ? `${v / 1000}rb` : String(v))}
          />
          <Tooltip formatter={(v) => formatIDR(Number(v))} />
          <Legend />
          <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
      {text}
    </div>
  );
}
