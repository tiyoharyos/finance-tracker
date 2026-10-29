export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <div className="h-8 w-48 rounded-lg bg-neutral-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-xl bg-neutral-200" />
        <div className="h-24 rounded-xl bg-neutral-200" />
        <div className="h-24 rounded-xl bg-neutral-200" />
      </div>
      <div className="h-64 rounded-xl bg-neutral-200" />
    </div>
  );
}
