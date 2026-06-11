"use client";

import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { getCustomers } from "@dashboardpack/core/lib/data";
import type { Customer } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {row.original.initials}
        </div>
        <div>
          <p className="text-sm font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "secondary"}
        className="capitalize text-[11px]"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
  },
  {
    accessorKey: "ordersCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orders" />
    ),
    meta: { className: "text-end" },
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Spent" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">
        ${row.original.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>
    ),
    meta: { className: "text-end" },
  },
];

export default function CustomersPage() {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const { data: allCustomers } = getCustomers({
    status: filter === "all" ? undefined : filter,
    perPage: 100,
  });

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Customers"
          description="View and manage your customer base."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Customers" },
          ]}
        />
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted p-0.5 w-fit">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              filter === f.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={allCustomers}
        searchPlaceholder="Search customers..."
        emptyMessage="No customers found."
        exportFilename="customers"
      />
    </>
  );
}
