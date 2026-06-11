"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Package } from "lucide-react";
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
import { getProducts, deleteProduct } from "@dashboardpack/core/lib/data";
import type { Product, ProductStatus } from "@dashboardpack/core/lib/data";
import { cn } from "@dashboardpack/core/lib/utils";

const statusFilters: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const statusVariant: Record<ProductStatus, "success" | "warning" | "secondary"> = {
  active: "success",
  draft: "warning",
  archived: "secondary",
};

export default function ProductsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const { data: allProducts } = getProducts({
    status: statusFilter === "all" ? undefined : statusFilter,
    perPage: 100,
  });

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
          </div>
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[11px]">{row.getValue("category")}</Badge>
      ),
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      },
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
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      meta: { className: "text-end" },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          ${row.original.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
      meta: { className: "text-end" },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
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
            <DropdownMenuItem onClick={() => router.push(`/products/${row.original.id}`)}>
              <Eye className="me-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/products/${row.original.id}/edit`)}>
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

  const handleBulkDelete = (selected: Product[]) => {
    selected.forEach((product) => deleteProduct(product.id));
    refresh();
  };

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Products"
          description="Browse and manage your product catalog."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Products" },
          ]}
        >
          <Button onClick={() => router.push("/products/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </PageHeader>
      </div>

      <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted p-0.5 w-fit">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              statusFilter === f.value
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
        data={allProducts}
        searchPlaceholder="Search products..."
        emptyMessage="No products found."
        onRowClick={(row) => router.push(`/products/${row.id}`)}
        exportFilename="products"
        enableRowSelection
        facetedFilters={[{ columnId: "category", title: "Category" }]}
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
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
            refresh();
          }
        }}
      />
    </>
  );
}
