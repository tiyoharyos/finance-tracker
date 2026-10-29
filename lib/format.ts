import { format, parse, isValid, startOfMonth, endOfMonth } from "date-fns";
import { id as localeId } from "date-fns/locale";

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const formatIDR = (n: number) => idr.format(n);

/** Param bulan berformat "yyyy-MM"; jatuh ke bulan ini bila tidak valid. */
export function resolveMonth(param?: string) {
  const parsed = param ? parse(param, "yyyy-MM", new Date()) : new Date();
  const date = isValid(parsed) ? parsed : new Date();
  return {
    value: format(date, "yyyy-MM"),
    label: format(date, "MMMM yyyy", { locale: localeId }),
    from: format(startOfMonth(date), "yyyy-MM-dd"),
    to: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export const formatDate = (iso: string) =>
  format(parse(iso, "yyyy-MM-dd", new Date()), "d MMM yyyy", {
    locale: localeId,
  });
