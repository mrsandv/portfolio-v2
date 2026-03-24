export default function SnippetsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <div className="h-4 w-16 rounded bg-muted animate-pulse mb-8" />
        <div className="mb-10">
          <div className="h-9 w-56 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-5 w-80 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="h-5 w-48 rounded bg-muted animate-pulse" />
                <div className="h-5 w-16 rounded bg-muted animate-pulse" />
              </div>
              <div className="mt-3 h-4 w-full rounded bg-muted animate-pulse" />
              <div className="mt-1 h-4 w-2/3 rounded bg-muted animate-pulse" />
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-14 rounded bg-muted animate-pulse" />
                <div className="h-5 w-14 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
