"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Package, User, ShoppingBag } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
import { getOrderById, deleteOrder } from "@dashboardpack/core/lib/data";
import type { OrderStatus } from "@dashboardpack/core/lib/data";

const statusVariant: Record<
  OrderStatus,
  "success" | "default" | "warning" | "destructive"
> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  cancelled: "destructive",
};

export default function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Order not found
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The order &quot;{id}&quot; does not exist or has been deleted.
        </p>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title={`Order ${order.id}`}
          description={`Placed on ${order.date}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders", href: "/orders" },
            { label: order.id },
          ]}
        >
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => router.push(`/orders/${order.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="gap-1.5"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </PageHeader>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-muted-foreground" />
              Order Details
            </CardTitle>
            <CardDescription>Core order information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-medium">{order.id}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={statusVariant[order.status]}
                className="capitalize text-[11px]"
              >
                {order.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm font-medium">{order.date}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-semibold">
                $
                {order.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-muted-foreground" />
              Customer
            </CardTitle>
            <CardDescription>Customer information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {order.customerInitials}
              </div>
              <div>
                <p className="text-sm font-medium">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {order.customerEmail}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              Product
            </CardTitle>
            <CardDescription>Purchased product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{order.productName}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm font-semibold">
                $
                {order.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Order"
        description={`Are you sure you want to delete order ${order.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          deleteOrder(order.id);
          router.push("/orders");
        }}
      />
    </>
  );
}
