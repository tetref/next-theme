"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const ecomStats = [
  {
    title: "Total Sales",
    value: "$128,430",
    change: 18.2,
    icon: DollarSign,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    stroke: "var(--chart-1)",
    sparkline: [42, 48, 45, 53, 60, 58, 65, 70, 68, 75, 80, 85],
  },
  {
    title: "Avg Order Value",
    value: "$64.50",
    change: 4.8,
    icon: ShoppingBag,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    stroke: "var(--chart-2)",
    sparkline: [55, 52, 58, 56, 60, 59, 62, 58, 63, 61, 64, 65],
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: 0.8,
    icon: TrendingUp,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    stroke: "var(--chart-3)",
    sparkline: [28, 30, 29, 31, 30, 32, 31, 33, 32, 34, 33, 32],
  },
  {
    title: "Refund Rate",
    value: "2.1%",
    change: -0.3,
    icon: RotateCcw,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    stroke: "var(--chart-4)",
    sparkline: [25, 23, 24, 22, 23, 21, 22, 20, 21, 20, 21, 21],
  },
];

// ── Daily Sales Data (30 days) ──

const dailySalesData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 3200 + Math.sin(i * 0.3) * 800;
  const revenue = Math.round(base + (i > 20 ? 600 : 0));
  const orders = Math.round(revenue / 62 + Math.sin(i * 0.5) * 8);
  const profit = Math.round(revenue * (0.28 + Math.sin(i * 0.4) * 0.06));
  return {
    date: `Feb ${day}`,
    revenue,
    orders,
    profit,
  };
});

// ── Order Status Data ──

const orderStatusData = [
  { name: "Completed", value: 584, fill: "var(--chart-1)" },
  { name: "Processing", value: 234, fill: "var(--chart-2)" },
  { name: "Pending", value: 127, fill: "var(--chart-3)" },
  { name: "Cancelled", value: 47, fill: "var(--chart-4)" },
];

const orderStatusTotal = orderStatusData.reduce((sum, d) => sum + d.value, 0);

// ── Top Products ──

const topProducts = [
  { name: "Pro Dashboard Template", category: "Templates", sold: 342, revenue: 17100, trend: [20, 24, 22, 28, 32, 30, 35, 38, 36, 40, 42, 45] },
  { name: "Enterprise License", category: "Licenses", sold: 156, revenue: 12480, trend: [15, 18, 16, 20, 19, 22, 24, 23, 26, 25, 28, 30] },
  { name: "UI Component Kit", category: "Components", sold: 289, revenue: 8670, trend: [30, 28, 32, 35, 33, 36, 34, 38, 40, 39, 42, 41] },
  { name: "Admin Starter Pack", category: "Templates", sold: 198, revenue: 7920, trend: [12, 15, 14, 18, 20, 19, 22, 24, 23, 25, 27, 26] },
  { name: "Analytics Module", category: "Modules", sold: 134, revenue: 5360, trend: [8, 10, 12, 11, 14, 16, 15, 18, 17, 20, 19, 22] },
  { name: "Email Template Pack", category: "Templates", sold: 267, revenue: 4005, trend: [25, 23, 26, 28, 27, 30, 32, 31, 33, 35, 34, 36] },
];

// ── Category Revenue ──

const categoryRevenue = [
  { category: "Templates", revenue: 28500 },
  { category: "Licenses", revenue: 12400 },
  { category: "Components", revenue: 8900 },
  { category: "Modules", revenue: 6200 },
];

// ── Recent Transactions ──

const recentTransactions = [
  { customer: "Sarah Chen", initials: "SC", product: "Pro Dashboard Template", amount: 49.99, status: "completed" as const, date: "Feb 22" },
  { customer: "Marcus Johnson", initials: "MJ", product: "Enterprise License", amount: 199.99, status: "completed" as const, date: "Feb 22" },
  { customer: "Priya Sharma", initials: "PS", product: "UI Component Kit", amount: 29.99, status: "processing" as const, date: "Feb 21" },
  { customer: "Alex Rivera", initials: "AR", product: "Admin Starter Pack", amount: 39.99, status: "completed" as const, date: "Feb 21" },
  { customer: "Emma Taylor", initials: "ET", product: "Analytics Module", amount: 39.99, status: "pending" as const, date: "Feb 20" },
  { customer: "David Park", initials: "DP", product: "Email Template Pack", amount: 14.99, status: "cancelled" as const, date: "Feb 20" },
];

// ── Revenue Targets ──

const revenueTargets = [
  { label: "Monthly Revenue", current: 128430, target: 150000, color: "bg-chart-1" },
  { label: "Orders", current: 992, target: 1200, color: "bg-chart-2" },
  { label: "New Customers", current: 347, target: 500, color: "bg-chart-3" },
];

// ── Status color map ──

const statusVariant: Record<string, "success" | "default" | "warning" | "destructive"> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  cancelled: "destructive",
};

// ── Chart Tooltip ──

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {entry.name === "Orders"
            ? entry.value
            : `$${entry.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-sm font-semibold">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value} orders</p>
    </div>
  );
}

// ── Sales Chart Tabs ──

const salesTabs = ["Revenue", "Orders", "Profit"] as const;
type SalesTab = (typeof salesTabs)[number];

// ── Page ──

export default function EcommercePage() {
  const [salesTab, setSalesTab] = useState<SalesTab>("Revenue");

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">eCommerce</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your sales performance and commerce metrics.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ecomStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const chartData = stat.sparkline.map((v) => ({ v }));

          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
              style={{
                animationDelay: `${i * 80}ms`,
                animation: "slide-in-up 0.4s ease-out backwards",
              }}
            >
              <CardContent className="p-5 pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isPositive ? "text-success" : "text-destructive"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {stat.change}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`ecom-gradient-${i}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={stat.stroke}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor={stat.stroke}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={stat.stroke}
                      strokeWidth={1.5}
                      fill={`url(#ecom-gradient-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Sales Overview + Order Status */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Sales Overview */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Sales Overview
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Daily performance for the current month
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
              {salesTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSalesTab(tab)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    salesTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              {salesTab === "Orders" ? (
                <BarChart data={dailySalesData} barCategoryGap="20%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    dy={8}
                    interval={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    dx={-8}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="var(--chart-3)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              ) : (
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient
                      id="ecomRevenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ecomProfitGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    dy={8}
                    interval={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    dx={-8}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={salesTab === "Revenue" ? "revenue" : "profit"}
                    name={salesTab}
                    stroke={
                      salesTab === "Revenue"
                        ? "var(--chart-1)"
                        : "var(--chart-2)"
                    }
                    strokeWidth={2}
                    fill={
                      salesTab === "Revenue"
                        ? "url(#ecomRevenueGrad)"
                        : "url(#ecomProfitGrad)"
                    }
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "var(--background)",
                    }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Order Status
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Distribution of current orders
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {orderStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">
                    {orderStatusTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Orders
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {orderStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Top Products + Category Revenue */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Top Selling Products */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Top Selling Products
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Best performers this month
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      #
                    </th>
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Sold
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Revenue
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, i) => {
                    const trendData = product.trend.map((v) => ({ v }));
                    return (
                      <tr
                        key={product.name}
                        className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="py-3 text-sm font-medium text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="py-3">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </td>
                        <td className="py-3 text-end text-sm font-semibold">
                          {product.sold.toLocaleString()}
                        </td>
                        <td className="py-3 text-end text-sm font-semibold">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="hidden py-3 sm:table-cell">
                          <div className="ms-auto h-8 w-20">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={trendData}
                                margin={{
                                  top: 2,
                                  right: 0,
                                  bottom: 0,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id={`prod-grad-${i}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="var(--chart-1)"
                                      stopOpacity={0.2}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="var(--chart-1)"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="v"
                                  stroke="var(--chart-1)"
                                  strokeWidth={1.5}
                                  fill={`url(#prod-grad-${i})`}
                                  dot={false}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Sales by Category
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Revenue distribution across product types
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryRevenue}
                layout="vertical"
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  width={85}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="var(--chart-2)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Transactions + Revenue Targets */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Recent Transactions */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Transactions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest customer orders
              </p>
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="hidden pb-3 text-start text-xs font-medium text-muted-foreground sm:table-cell">
                      Product
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.customer}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                            {tx.initials}
                          </div>
                          <span className="text-sm font-medium">
                            {tx.customer}
                          </span>
                        </div>
                      </td>
                      <td className="hidden py-3 text-sm text-muted-foreground sm:table-cell">
                        {tx.product}
                      </td>
                      <td className="py-3 text-end text-sm font-semibold">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-end">
                        <Badge
                          variant={statusVariant[tx.status]}
                          className="capitalize"
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="hidden py-3 text-end text-sm text-muted-foreground sm:table-cell">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Targets */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Revenue Targets
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Monthly progress toward goals
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {revenueTargets.map((target) => {
              const pct = Math.round((target.current / target.target) * 100);
              return (
                <div key={target.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {target.label}
                    </span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} indicatorClassName={target.color} />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {target.label === "Monthly Revenue"
                        ? `$${target.current.toLocaleString()}`
                        : target.current.toLocaleString()}
                    </span>
                    <span>
                      Target:{" "}
                      {target.label === "Monthly Revenue"
                        ? `$${target.target.toLocaleString()}`
                        : target.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
