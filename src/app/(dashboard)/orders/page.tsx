"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { getOrders, deleteOrder } from "@dashboardpack/core/lib/data";
import type { Order, OrderStatus } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

const statusVariant: Record<OrderStatus, "success" | "default" | "warning" | "destructive"> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  cancelled: "destructive",
};

export default function OrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const { data: allOrders } = getOrders({
    status: filter === "all" ? undefined : filter,
    perPage: 100,
  });

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      size: 40,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.getValue("id")}</span>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {row.original.customerInitials}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.customerName}</p>
            <p className="text-xs text-muted-foreground">{row.original.customerEmail}</p>
          </div>
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]} className="capitalize text-[11px]">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
    },
    {
      id: "trend",
      header: "Trend",
      cell: ({ row }) => {
        const trend = row.original.trend;
        if (!trend) return null;
        const data = trend.map((v) => ({ v }));
        const isUp = trend[trend.length - 1] >= trend[0];
        return (
          <ResponsiveContainer width={80} height={28}>
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isUp ? "var(--color-success)" : "var(--color-destructive)"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { className: "w-24 hidden md:table-cell", mobileHidden: true },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          ${row.original.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
      meta: { className: "text-end" },
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      meta: { className: "w-10" },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/orders/${row.original.id}`)}>
              <Eye className="me-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/orders/${row.original.id}/edit`)}>
              <Pencil className="me-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="me-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleBulkDelete = (selected: Order[]) => {
    selected.forEach((order) => deleteOrder(order.id));
    refresh();
  };

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Orders"
          description="Manage and track all customer orders."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders" },
          ]}
        >
          <Button onClick={() => router.push("/orders/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </PageHeader>
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
        data={allOrders}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found."
        onRowClick={(row) => router.push(`/orders/${row.id}`)}
        exportFilename="orders"
        enableRowSelection
        bulkActions={(selected) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkDelete(selected)}
          >
            <Trash2 className="me-1 size-3.5" />
            Delete ({selected.length})
          </Button>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Order"
        description={`Are you sure you want to delete order ${deleteTarget?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) {
            deleteOrder(deleteTarget.id);
            setDeleteTarget(null);
            refresh();
          }
        }}
      />
    </>
  );
}
