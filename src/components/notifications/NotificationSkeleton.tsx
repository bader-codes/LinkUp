export default function NotificationSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 px-3 py-3">
      <div className="size-10 shrink-0 rounded-full bg-muted" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-2.5 w-1/4 rounded bg-muted" />
      </div>
    </div>
  );
}
