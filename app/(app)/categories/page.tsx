import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import { getCategories } from "@/lib/data";
import { deleteCategory, seedDefaultCategories } from "@/lib/actions";
import { CategoryForm } from "@/components/category-form";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export const metadata = { title: "Kategori · Finance Tracker" };

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Kategori</h1>
      <CategoryForm />
      <Suspense fallback={<PageSkeleton />}>
        <CategoryLists />
      </Suspense>
    </div>
  );
}

async function CategoryLists() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center">
        <p className="text-sm text-neutral-500">Belum ada kategori.</p>
        <form action={seedDefaultCategories} className="mt-3">
          <button className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
            Tambah kategori bawaan
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["income", "expense"] as const).map((type) => (
        <section key={type} className="rounded-xl border border-neutral-200 bg-white">
          <h2 className="border-b border-neutral-100 px-4 py-3 text-sm font-medium">
            {type === "income" ? "Pemasukan" : "Pengeluaran"}
          </h2>
          <ul className="divide-y divide-neutral-100">
            {categories
              .filter((c) => c.type === type)
              .map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  {c.name}
                  <form action={deleteCategory.bind(null, c.id)}>
                    <button
                      aria-label={`Hapus ${c.name}`}
                      className="rounded-md p-1.5 text-neutral-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
