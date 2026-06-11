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
  Users,
  UserMinus,
  UserCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const saasStats = [
  {
    title: "MRR",
    value: "$48.2K",
    change: 8.4,
    icon: DollarSign,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    stroke: "var(--chart-1)",
    sparkline: [32, 35, 33, 37, 38, 40, 39, 42, 44, 45, 47, 48],
    invertTrend: false,
  },
  {
    title: "Active Users",
    value: "2,847",
    change: 12.6,
    icon: Users,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    stroke: "var(--chart-2)",
    sparkline: [18, 20, 19, 22, 23, 21, 24, 25, 24, 26, 27, 28],
    invertTrend: false,
  },
  {
    title: "Churn Rate",
    value: "3.2%",
    change: -0.5,
    icon: UserMinus,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    stroke: "var(--chart-3)",
    sparkline: [42, 40, 41, 38, 37, 39, 36, 35, 34, 34, 33, 32],
    invertTrend: true,
  },
  {
    title: "Trial Conversion",
    value: "24.8%",
    change: 2.3,
    icon: UserCheck,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    stroke: "var(--chart-4)",
    sparkline: [18, 19, 18, 20, 21, 20, 22, 23, 22, 24, 24, 25],
    invertTrend: false,
  },
];

// ── Revenue Growth Data (12 months) ──

const revenueGrowthData = [
  { month: "Mar", mrr: 31200, arr: 374400 },
  { month: "Apr", mrr: 32800, arr: 393600 },
  { month: "May", mrr: 33500, arr: 402000 },
  { month: "Jun", mrr: 35100, arr: 421200 },
  { month: "Jul", mrr: 36400, arr: 436800 },
  { month: "Aug", mrr: 37800, arr: 453600 },
  { month: "Sep", mrr: 39200, arr: 470400 },
  { month: "Oct", mrr: 40600, arr: 487200 },
  { month: "Nov", mrr: 42500, arr: 510000 },
  { month: "Dec", mrr: 44100, arr: 529200 },
  { month: "Jan", mrr: 46300, arr: 555600 },
  { month: "Feb", mrr: 48200, arr: 578400 },
];

// ── Subscription Plans ──

const subscriptionPlansData = [
  { name: "Free", value: 842, fill: "var(--chart-4)" },
  { name: "Starter", value: 1234, fill: "var(--chart-2)" },
  { name: "Pro", value: 628, fill: "var(--chart-1)" },
  { name: "Enterprise", value: 143, fill: "var(--chart-3)" },
];

const subscriptionTotal = subscriptionPlansData.reduce(
  (sum, d) => sum + d.value,
  0
);

// ── Marketing Channels ──

const marketingChannels = [
  { channel: "Organic Search", visitors: 18420, signups: 842, convPct: 4.6, cpa: 0 },
  { channel: "Paid Ads", visitors: 9240, signups: 416, convPct: 4.5, cpa: 38 },
  { channel: "Social Media", visitors: 6830, signups: 241, convPct: 3.5, cpa: 24 },
  { channel: "Email", visitors: 4120, signups: 318, convPct: 7.7, cpa: 12 },
  { channel: "Referrals", visitors: 3290, signups: 198, convPct: 6.0, cpa: 18 },
  { channel: "Direct", visitors: 5640, signups: 167, convPct: 3.0, cpa: 0 },
];

// ── User Growth (6 months) ──

const userGrowthData = [
  { month: "Sep", newUsers: 284 },
  { month: "Oct", newUsers: 312 },
  { month: "Nov", newUsers: 298 },
  { month: "Dec", newUsers: 341 },
  { month: "Jan", newUsers: 378 },
  { month: "Feb", newUsers: 356 },
];

// ── Recent Signups ──

const recentSignups = [
  { name: "Sofia Andersen", initials: "SA", email: "sofia@nordloop.io", plan: "pro" as const, date: "Feb 22" },
  { name: "Marcus Webb", initials: "MW", email: "m.webb@stackfire.com", plan: "starter" as const, date: "Feb 22" },
  { name: "Priya Kulkarni", initials: "PK", email: "priya@brightpath.app", plan: "enterprise" as const, date: "Feb 21" },
  { name: "Tomás Barrera", initials: "TB", email: "tomas@veloz.mx", plan: "pro" as const, date: "Feb 21" },
  { name: "Yuki Tanaka", initials: "YT", email: "yuki@launchpad.jp", plan: "free" as const, date: "Feb 20" },
  { name: "Amara Osei", initials: "AO", email: "amara@growcraft.ng", plan: "starter" as const, date: "Feb 20" },
];

// ── Plan badge variant map ──

const planVariant: Record<string, "success" | "default" | "warning" | "secondary"> = {
  enterprise: "success",
  pro: "default",
  starter: "warning",
  free: "secondary",
};

// ── Growth Targets ──

const growthTargets = [
  { label: "MRR Target", current: 48200, target: 60000, color: "bg-chart-1", isMoney: true, suffix: "" },
  { label: "Active Users", current: 2847, target: 3500, color: "bg-chart-2", isMoney: false, suffix: "" },
  { label: "Trial \u2192 Paid Conv.", current: 24.8, target: 30, color: "bg-chart-4", isMoney: false, suffix: "%" },
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
          {entry.name}:{" "}
          {entry.name === "New Users"
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
      <p className="text-xs text-muted-foreground">
        {payload[0].value.toLocaleString()} users
      </p>
    </div>
  );
}

// ── Revenue Chart Tabs ──

const revenueTabs = ["MRR", "ARR"] as const;
type RevenueTab = (typeof revenueTabs)[number];

// ── Page ──

export default function SaasPage() {
  const [revenueTab, setRevenueTab] = useState<RevenueTab>("MRR");

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SaaS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor subscription revenue and marketing performance.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {saasStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const isGood = stat.invertTrend ? !isPositive : isPositive;
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
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`saas-stat-${i}`}
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
                      fill={`url(#saas-stat-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Revenue Growth + Subscription Plans */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Revenue Growth */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Revenue Growth
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {revenueTab === "MRR"
                  ? "Monthly Recurring Revenue"
                  : "Annual Recurring Revenue"}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
              {revenueTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRevenueTab(tab)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    revenueTab === tab
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
              <AreaChart data={revenueGrowthData}>
                <defs>
                  <linearGradient
                    id="saas-mrr-grad"
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
                    id="saas-arr-grad"
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
                  dataKey={revenueTab === "MRR" ? "mrr" : "arr"}
                  name={revenueTab}
                  stroke={
                    revenueTab === "MRR"
                      ? "var(--chart-1)"
                      : "var(--chart-2)"
                  }
                  strokeWidth={2}
                  fill={
                    revenueTab === "MRR"
                      ? "url(#saas-mrr-grad)"
                      : "url(#saas-arr-grad)"
                  }
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

        {/* Subscription Plans Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Subscription Plans
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Users by plan tier
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subscriptionPlansData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {subscriptionPlansData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">
                    {subscriptionTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Users
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {subscriptionPlansData.map((item) => (
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
                    <span className="text-xs font-semibold">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Marketing Channels + User Growth */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Marketing Channels */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Marketing Channels
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Acquisition performance by channel
              </p>
            </div>
            <Link
              href="/analytics"
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
                      Channel
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Visitors
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Signups
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Conv%
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      CPA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketingChannels.map((ch) => (
                    <tr
                      key={ch.channel}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 text-sm font-medium">
                        {ch.channel}
                      </td>
                      <td className="py-3 text-end text-sm text-muted-foreground">
                        {ch.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 text-end text-sm font-semibold">
                        {ch.signups.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "hidden py-3 text-end text-sm font-semibold sm:table-cell",
                          ch.convPct >= 6
                            ? "text-success"
                            : ch.convPct < 4
                              ? "text-muted-foreground"
                              : ""
                        )}
                      >
                        {ch.convPct}%
                      </td>
                      <td className="hidden py-3 text-end text-sm text-muted-foreground sm:table-cell">
                        {ch.cpa === 0 ? "—" : `$${ch.cpa}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              User Growth
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Net new subscribers, last 6 months
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={userGrowthData}
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
                />
                <YAxis
                  dataKey="month"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="newUsers"
                  name="New Users"
                  fill="var(--chart-3)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Signups + Growth Targets */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Recent Signups */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Signups
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest user registrations
              </p>
            </div>
            <Link
              href="/customers"
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
                      User
                    </th>
                    <th className="hidden pb-3 text-start text-xs font-medium text-muted-foreground sm:table-cell">
                      Email
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Plan
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Signed Up
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSignups.map((signup) => (
                    <tr
                      key={signup.email}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                            {signup.initials}
                          </div>
                          <span className="text-sm font-medium">
                            {signup.name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden py-3 text-sm text-muted-foreground sm:table-cell">
                        {signup.email}
                      </td>
                      <td className="py-3 text-end">
                        <Badge
                          variant={planVariant[signup.plan]}
                          className="capitalize"
                        >
                          {signup.plan}
                        </Badge>
                      </td>
                      <td className="py-3 text-end text-sm text-muted-foreground">
                        {signup.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Growth Targets */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Growth Targets
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Progress toward quarterly goals
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {growthTargets.map((target) => {
              const pct = Math.round((target.current / target.target) * 100);
              const fmt = (n: number) => {
                if (target.isMoney) return `$${(n / 1000).toFixed(1)}k`;
                if (target.suffix === "%") return `${n}%`;
                return n.toLocaleString();
              };
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
                    <span>{fmt(target.current)}</span>
                    <span>Target: {fmt(target.target)}</span>
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
