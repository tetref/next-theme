"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
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
  Briefcase,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const crmStats = [
  {
    title: "Total Pipeline",
    value: "$842K",
    change: 12.4,
    icon: Briefcase,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    stroke: "var(--chart-1)",
    sparkline: [38, 42, 40, 48, 55, 52, 60, 65, 63, 70, 75, 82],
  },
  {
    title: "Won This Month",
    value: "$284K",
    change: 22.1,
    icon: Trophy,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    stroke: "var(--chart-2)",
    sparkline: [22, 28, 25, 30, 32, 35, 33, 38, 40, 42, 44, 48],
  },
  {
    title: "Win Rate",
    value: "34.2%",
    change: 3.8,
    icon: Target,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    stroke: "var(--chart-3)",
    sparkline: [28, 30, 29, 31, 30, 33, 32, 34, 33, 35, 34, 34],
  },
  {
    title: "Avg Deal Size",
    value: "$18.4K",
    change: -2.1,
    icon: TrendingUp,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    stroke: "var(--chart-4)",
    sparkline: [20, 22, 19, 21, 18, 19, 18, 17, 19, 18, 18, 18],
  },
];

// ── Pipeline Data (12 months) ──

const pipelineData = [
  { month: "Mar", value: 420000, count: 28 },
  { month: "Apr", value: 385000, count: 24 },
  { month: "May", value: 510000, count: 33 },
  { month: "Jun", value: 475000, count: 31 },
  { month: "Jul", value: 540000, count: 36 },
  { month: "Aug", value: 498000, count: 32 },
  { month: "Sep", value: 620000, count: 41 },
  { month: "Oct", value: 585000, count: 38 },
  { month: "Nov", value: 710000, count: 47 },
  { month: "Dec", value: 668000, count: 44 },
  { month: "Jan", value: 780000, count: 52 },
  { month: "Feb", value: 842000, count: 56 },
];

// ── Deal Stage Data ──

const dealStageData = [
  { name: "Qualified", value: 124, fill: "var(--chart-1)" },
  { name: "Proposal", value: 89, fill: "var(--chart-2)" },
  { name: "Negotiation", value: 52, fill: "var(--chart-3)" },
  { name: "Closed Won", value: 67, fill: "var(--chart-4)" },
  { name: "Closed Lost", value: 43, fill: "var(--chart-5)" },
];

const dealStageTotal = dealStageData.reduce((sum, d) => sum + d.value, 0);

// ── Top Sales Reps ──

const salesReps = [
  { name: "Jordan Mills", initials: "JM", role: "Enterprise", won: 18, revenue: 82400, rate: 58 },
  { name: "Priya Nakamura", initials: "PN", role: "Mid-Market", won: 24, revenue: 74800, rate: 52 },
  { name: "Carlos Reyes", initials: "CR", role: "SMB", won: 31, revenue: 48200, rate: 45 },
  { name: "Aisha Thompson", initials: "AT", role: "Enterprise", won: 11, revenue: 41600, rate: 39 },
  { name: "Leo Bergstrom", initials: "LB", role: "Mid-Market", won: 19, revenue: 37400, rate: 34 },
];

// ── Lead Sources ──

const leadSourceData = [
  { source: "Website", leads: 312 },
  { source: "Referral", leads: 248 },
  { source: "LinkedIn", leads: 184 },
  { source: "Cold Outreach", leads: 127 },
  { source: "Events", leads: 93 },
];

// ── Recent Deals ──

const recentDeals = [
  { deal: "Zenith Platform License", company: "Nexora Corp", value: 48000, stage: "closed-won" as const, close: "Feb 22" },
  { deal: "Enterprise Bundle", company: "Stratus Health", value: 32500, stage: "negotiation" as const, close: "Feb 28" },
  { deal: "Starter Plan Upgrade", company: "Bloom Studios", value: 9800, stage: "proposal" as const, close: "Mar 4" },
  { deal: "Data Module", company: "Orion Analytics", value: 14200, stage: "qualified" as const, close: "Mar 10" },
  { deal: "Pro Seats x40", company: "Veridian Group", value: 21600, stage: "negotiation" as const, close: "Mar 15" },
  { deal: "Annual Renewal", company: "Cascade Systems", value: 8400, stage: "closed-lost" as const, close: "Feb 19" },
];

// ── Stage variant + label maps ──

const stageVariant: Record<string, "success" | "default" | "warning" | "destructive" | "secondary"> = {
  "closed-won": "success",
  "negotiation": "default",
  "proposal": "warning",
  "qualified": "secondary",
  "closed-lost": "destructive",
};

const stageLabel: Record<string, string> = {
  "closed-won": "Closed Won",
  "negotiation": "Negotiation",
  "proposal": "Proposal",
  "qualified": "Qualified",
  "closed-lost": "Closed Lost",
};

// ── Quarterly Targets ──

const quarterlyTargets = [
  { label: "Pipeline Value", current: 842000, target: 1200000, color: "bg-chart-1", isMoney: true },
  { label: "Deals Closed", current: 67, target: 100, color: "bg-chart-2", isMoney: false },
  { label: "New Contacts", current: 284, target: 400, color: "bg-chart-3", isMoney: false },
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
          {entry.name === "Deals"
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
      <p className="text-xs text-muted-foreground">{payload[0].value} deals</p>
    </div>
  );
}

// ── Pipeline Chart Tabs ──

const pipelineTabs = ["Value", "Count"] as const;
type PipelineTab = (typeof pipelineTabs)[number];

// ── Page ──

export default function CrmPage() {
  const [pipelineTab, setPipelineTab] = useState<PipelineTab>("Value");

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your sales pipeline, deals, and team performance.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {crmStats.map((stat, i) => {
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
                        id={`crm-stat-${i}`}
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
                      fill={`url(#crm-stat-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Pipeline Overview + Deal Stage */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Pipeline Overview */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Pipeline Overview
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monthly pipeline performance over the past year
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
              {pipelineTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPipelineTab(tab)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    pipelineTab === tab
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
              {pipelineTab === "Count" ? (
                <BarChart data={pipelineData} barCategoryGap="20%">
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
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                  />
                  <Bar
                    dataKey="count"
                    name="Deals"
                    fill="var(--chart-3)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              ) : (
                <AreaChart data={pipelineData}>
                  <defs>
                    <linearGradient
                      id="crm-pipeline-grad"
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
                    dataKey="value"
                    name="Pipeline Value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#crm-pipeline-grad)"
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

        {/* Deal Stage Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Deal Stages
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Distribution of active deals
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dealStageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {dealStageData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">
                    {dealStageTotal}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Deals
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {dealStageData.map((item) => (
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

      {/* Row 3: Top Sales Reps + Lead Sources */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Top Sales Reps */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Top Sales Reps
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Best performers this quarter
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
                      #
                    </th>
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      Rep
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Won
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Revenue
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesReps.map((rep, i) => (
                    <tr
                      key={rep.name}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 text-sm font-medium text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-[11px] font-bold">
                              {rep.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{rep.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {rep.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-3 text-end text-sm font-semibold sm:table-cell">
                        {rep.won}
                      </td>
                      <td className="py-3 text-end text-sm font-semibold">
                        ${rep.revenue.toLocaleString()}
                      </td>
                      <td className="hidden py-3 sm:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <Progress
                            value={rep.rate}
                            className="h-1.5 w-16"
                            indicatorClassName="bg-chart-1"
                          />
                          <span className="w-8 text-end text-xs text-muted-foreground">
                            {rep.rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Lead Sources
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Where your leads come from
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={leadSourceData}
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
                  dataKey="source"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads"
                  fill="var(--chart-2)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Deals + Quarterly Targets */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Recent Deals */}
        <Card className="xl:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Deals
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest pipeline activity
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
                      Deal
                    </th>
                    <th className="hidden pb-3 text-start text-xs font-medium text-muted-foreground sm:table-cell">
                      Company
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Stage
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Close
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((deal) => (
                    <tr
                      key={deal.deal}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3">
                        <p className="text-sm font-medium">{deal.deal}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {deal.company}
                        </p>
                      </td>
                      <td className="hidden py-3 text-sm text-muted-foreground sm:table-cell">
                        {deal.company}
                      </td>
                      <td className="py-3 text-end text-sm font-semibold">
                        ${deal.value.toLocaleString()}
                      </td>
                      <td className="py-3 text-end">
                        <Badge
                          variant={stageVariant[deal.stage]}
                          className="capitalize"
                        >
                          {stageLabel[deal.stage]}
                        </Badge>
                      </td>
                      <td className="hidden py-3 text-end text-sm text-muted-foreground sm:table-cell">
                        {deal.close}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quarterly Targets */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Quarterly Targets
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Progress toward Q1 goals
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {quarterlyTargets.map((target) => {
              const pct = Math.round((target.current / target.target) * 100);
              const fmt = (n: number) =>
                target.isMoney
                  ? `$${(n / 1000).toFixed(0)}k`
                  : n.toLocaleString();
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
