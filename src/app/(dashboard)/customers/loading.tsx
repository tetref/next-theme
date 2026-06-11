import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      {/* Page header with breadcrumbs */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* Status filter tabs */}
      <Skeleton className="h-9 w-52 rounded-lg" />

      {/* Data table card */}
      <div className="rounded-md border">
        {/* Search + export bar */}
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t px-4 py-3">
            {/* Avatar + name/email */}
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            {/* Status badge */}
            <Skeleton className="h-5 w-16 rounded-full" />
            {/* Join date */}
            <Skeleton className="h-4 w-24" />
            {/* Orders */}
            <Skeleton className="ms-auto h-4 w-8" />
            {/* Total spent */}
            <Skeleton className="h-4 w-20" />
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
