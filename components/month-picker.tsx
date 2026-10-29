"use client";

import { useRouter, usePathname } from "next/navigation";

export function MonthPicker({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <input
      type="month"
      value={value}
      aria-label="Pilih bulan"
      onChange={(e) => e.target.value && router.push(`${pathname}?month=${e.target.value}`)}
      className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-600"
    />
  );
}
