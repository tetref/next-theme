"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Package, Calendar, DollarSign, Boxes } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { getProductById, deleteProduct } from "@dashboardpack/core/lib/data";
import type { ProductStatus } from "@dashboardpack/core/lib/data";

const statusVariant: Record<ProductStatus, "success" | "warning" | "secondary"> = {
  active: "success",
  draft: "warning",
  archived: "secondary",
};

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title={product.name}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Products", href: "/products" },
            { label: product.name },
          ]}
        >
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => router.push(`/products/${id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="gap-1.5"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </PageHeader>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main info card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
              <p className="text-sm">{product.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{product.description}</p>
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <Badge variant={statusVariant[product.status]} className="capitalize">
                  {product.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {product.createdAt}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Image placeholder card */}
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Pricing card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Price
                </div>
                <span className="text-lg font-semibold">
                  ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Boxes className="h-4 w-4" />
                  Stock
                </div>
                <span className="text-lg font-semibold">
                  {product.stock.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          deleteProduct(id);
          router.push("/products");
        }}
      />
    </>
  );
}
