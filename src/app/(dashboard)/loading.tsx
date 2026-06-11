import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[138px] w-full rounded-xl" />
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Skeleton className="h-[420px] w-full rounded-xl xl:col-span-8" />
        <Skeleton className="h-[420px] w-full rounded-xl xl:col-span-4" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Skeleton className="h-[400px] w-full rounded-xl xl:col-span-8" />
        <Skeleton className="h-[400px] w-full rounded-xl xl:col-span-4" />
      </div>
    </div>
  );
}
