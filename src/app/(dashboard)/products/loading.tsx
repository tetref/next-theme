import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-96" />
      <div className="rounded-md border">
        <div className="p-4">
          <Skeleton className="h-9 w-64 mb-4" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t px-4 py-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="ms-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
