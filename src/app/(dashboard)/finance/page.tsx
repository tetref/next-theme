"use client";

import React from "react";
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
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const financeStats = [
  {
    title: "Total Revenue",
    value: "$284K",
    change: 14.2,
    icon: DollarSign,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    title: "Expenses",
    value: "$142K",
    change: 8.4,
    icon: CreditCard,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    invertTrend: true,
  },
  {
    title: "Net Profit",
    value: "$142K",
    change: 20.1,
    icon: Wallet,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    title: "Profit Margin",
    value: "50%",
    change: 3.6,
    icon: Percent,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

// ── Revenue vs Expenses (12 months) ──

const revenueExpenseData = [
  { month: "Mar", revenue: 18200, expenses: 9800 },
  { month: "Apr", revenue: 19400, expenses: 10200 },
  { month: "May", revenue: 20800, expenses: 10600 },
  { month: "Jun", revenue: 22100, expenses: 11400 },
  { month: "Jul", revenue: 21600, expenses: 11800 },
  { month: "Aug", revenue: 23400, expenses: 12200 },
  { month: "Sep", revenue: 24800, expenses: 12600 },
  { month: "Oct", revenue: 25200, expenses: 11800 },
  { month: "Nov", revenue: 26400, expenses: 12400 },
  { month: "Dec", revenue: 28800, expenses: 13200 },
  { month: "Jan", revenue: 27200, expenses: 12800 },
  { month: "Feb", revenue: 28400, expenses: 14200 },
];

// ── Expense Breakdown ──

const expenseBreakdownData = [
  { name: "Salaries", value: 45, fill: "var(--chart-1)" },
  { name: "Marketing", value: 20, fill: "var(--chart-2)" },
  { name: "Infrastructure", value: 15, fill: "var(--chart-3)" },
  { name: "Operations", value: 12, fill: "var(--chart-4)" },
  { name: "Other", value: 8, fill: "var(--chart-5)" },
];

const expenseTotal = "$142K";

// ── Cash Flow (12 months) ──

const cashFlowData = [
  { month: "Mar", cashFlow: 8400 },
  { month: "Apr", cashFlow: 9200 },
  { month: "May", cashFlow: 10200 },
  { month: "Jun", cashFlow: 10700 },
  { month: "Jul", cashFlow: 9800 },
  { month: "Aug", cashFlow: 11200 },
  { month: "Sep", cashFlow: 12200 },
  { month: "Oct", cashFlow: 13400 },
  { month: "Nov", cashFlow: 14000 },
  { month: "Dec", cashFlow: 15600 },
  { month: "Jan", cashFlow: 14400 },
  { month: "Feb", cashFlow: 14200 },
];

// ── Budget vs Actual ──

const budgetData = [
  { department: "Engineering", budget: 48000, actual: 45200 },
  { department: "Marketing", budget: 28000, actual: 31400 },
  { department: "Sales", budget: 22000, actual: 19800 },
  { department: "Operations", budget: 18000, actual: 17200 },
  { department: "Support", budget: 12000, actual: 11400 },
];

// ── Chart Tooltips ──

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
          {entry.name}: ${entry.value.toLocaleString()}
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
      <p className="text-xs text-muted-foreground">
        {payload[0].value}% of total expenses
      </p>
    </div>
  );
}

// ── Page ──

export default function FinancePage() {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track revenue, expenses, cash flow, and departmental budgets.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const invertTrend = "invertTrend" in stat && stat.invertTrend;
          const isGood = invertTrend ? !isPositive : isPositive;

          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
              style={{
                animationDelay: `${i * 80}ms`,
                animation: "slide-in-up 0.4s ease-out backwards",
              }}
            >
              <CardContent className="p-5">
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
                        <TrendingUp
                          className={cn(
                            "h-3.5 w-3.5",
                            isGood ? "text-success" : "text-destructive"
                          )}
                        />
                      ) : (
                        <TrendingDown
                          className={cn(
                            "h-3.5 w-3.5",
                            isGood ? "text-success" : "text-destructive"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isGood ? "text-success" : "text-destructive"
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
            </Card>
          );
        })}
      </div>

      {/* Row 2: Revenue vs Expenses + Expense Breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Revenue vs Expenses */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Revenue vs Expenses
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monthly comparison over the past 12 months
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={revenueExpenseData}
                barCategoryGap="20%"
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  dx={-8}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--chart-3)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Expense Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Distribution of total expenses
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {expenseBreakdownData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">{expenseTotal}</span>
                  <span className="text-[10px] text-muted-foreground">
                    Total
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {expenseBreakdownData.map((item) => (
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
                    <span className="text-xs font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Cash Flow + Budget vs Actual */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Cash Flow */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Cash Flow
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monthly net cash flow over the past 12 months
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient
                    id="fin-cashflow-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--success)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--success)"
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
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  dx={-8}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cashFlow"
                  name="Cash Flow"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#fin-cashflow-grad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "var(--background)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Budget vs Actual
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Department spending against allocated budgets
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {budgetData.map((dept) => {
                const pct = Math.round((dept.actual / dept.budget) * 100);
                const isOver = dept.actual > dept.budget;
                const variance = dept.actual - dept.budget;
                const varianceAbs = Math.abs(variance);

                return (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {dept.department}
                      </span>
                      <Badge
                        variant={isOver ? "destructive" : "success"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {isOver ? "+" : "-"}${(varianceAbs / 1000).toFixed(1)}k
                      </Badge>
                    </div>
                    <Progress
                      value={Math.min(pct, 100)}
                      indicatorClassName={isOver ? "bg-destructive" : "bg-success"}
                    />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        Actual: ${(dept.actual / 1000).toFixed(1)}k
                      </span>
                      <span>
                        Budget: ${(dept.budget / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
