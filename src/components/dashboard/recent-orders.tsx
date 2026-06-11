"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { getRecentOrders } from "@dashboardpack/core/lib/data";
import type { OrderStatus } from "@dashboardpack/core/lib/data";

const statusVariant: Record<OrderStatus, "success" | "default" | "warning" | "destructive"> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  cancelled: "destructive",
};

const avatarColors = [
  "from-chart-1/70 to-chart-1",
  "from-chart-2/70 to-chart-2",
  "from-chart-3/70 to-chart-3",
  "from-chart-4/70 to-chart-4",
  "from-chart-5/70 to-chart-5",
];

export function RecentOrders() {
  const orders = getRecentOrders(6);

  return (
    <Card className="col-span-full xl:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest transactions from your store
          </p>
        </div>
        <Link
          href="/orders"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Customer</th>
                <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Order ID</th>
                <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Product</th>
                <th className="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
                <th className="pb-3 text-end text-xs font-medium text-muted-foreground">Amount</th>
                <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  className="group border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-[10px] font-bold text-white`}
                        >
                          {order.customerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-sm">{order.productName}</span>
                  </td>
                  <td className="py-3.5">
                    <Badge variant={statusVariant[order.status]} className="capitalize text-[11px]">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-end">
                    <span className="text-sm font-semibold">
                      ${order.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3.5 text-end">
                    <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-accent group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
