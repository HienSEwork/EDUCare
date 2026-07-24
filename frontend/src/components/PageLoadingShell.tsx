import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoadingShell({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="min-h-[70vh] bg-background px-5 pb-16 pt-12 text-foreground sm:px-6"
      role="status"
      aria-live="polite"
      aria-label="Đang tải nội dung"
    >
      <div className="site-shell animate-in fade-in duration-300">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div className="mx-auto w-full max-w-2xl space-y-5 lg:mx-0">
            <Skeleton className="h-9 w-52 rounded-full" />
            <Skeleton className="h-12 w-full max-w-xl rounded-2xl sm:h-16" />
            <Skeleton className="h-12 w-full max-w-2xl rounded-2xl" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-28 rounded-full" />
            </div>
          </div>
          {!compact && <Skeleton className="mx-auto aspect-[4/3] w-full max-w-[420px] rounded-3xl" />}
        </div>

        {!compact && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <Skeleton className="mt-5 h-6 w-4/5 rounded-lg" />
                <Skeleton className="mt-3 h-4 w-full rounded-lg" />
                <Skeleton className="mt-2 h-4 w-2/3 rounded-lg" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
