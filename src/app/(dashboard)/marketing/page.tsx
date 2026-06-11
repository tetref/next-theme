"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  AreaChart,
  Area,
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
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const marketingStats = [
  {
    title: "Campaign Spend",
    value: "$45.2K",
    change: 6.8,
    icon: DollarSign,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    stroke: "var(--chart-1)",
    sparkline: [28, 32, 30, 35, 37, 34, 38, 40, 39, 42, 44, 45],
  },
  {
    title: "Total Leads",
    value: "3,847",
    change: 18.2,
    icon: Users,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    stroke: "var(--chart-2)",
    sparkline: [22, 24, 26, 28, 27, 30, 32, 31, 34, 36, 37, 38],
  },
  {
    title: "Conversion Rate",
    value: "4.2%",
    change: 0.8,
    icon: Target,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    stroke: "var(--chart-3)",
    sparkline: [30, 32, 31, 34, 33, 35, 36, 35, 38, 39, 40, 42],
  },
  {
    title: "Cost Per Lead",
    value: "$11.74",
    change: -3.2,
    icon: Percent,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    stroke: "var(--chart-4)",
    sparkline: [18, 17, 18, 16, 15, 16, 14, 14, 13, 13, 12, 12],
    invertTrend: true,
  },
];

// ── Campaign Performance (6 months) ──

const campaignPerformanceData = [
  { month: "Sep", impressions: 284000, clicks: 12400 },
  { month: "Oct", impressions: 312000, clicks: 14200 },
  { month: "Nov", impressions: 298000, clicks: 13800 },
  { month: "Dec", impressions: 356000, clicks: 16900 },
  { month: "Jan", impressions: 378000, clicks: 18200 },
  { month: "Feb", impressions: 402000, clicks: 19800 },
];

// ── Channel Mix ──

const channelMixData = [
  { name: "Social", value: 35, fill: "var(--chart-1)" },
  { name: "Search", value: 28, fill: "var(--chart-2)" },
  { name: "Email", value: 22, fill: "var(--chart-3)" },
  { name: "Referral", value: 15, fill: "var(--chart-4)" },
];

const channelMixTotal = channelMixData.reduce((sum, d) => sum + d.value, 0);

// ── Top Campaigns ──

const topCampaigns = [
  { name: "Spring Product Launch", status: "active" as const, impressions: 142000, clicks: 6840, ctr: 4.8, conversions: 312, spend: 8400 },
  { name: "Brand Awareness Q1", status: "active" as const, impressions: 98000, clicks: 3920, ctr: 4.0, conversions: 184, spend: 6200 },
  { name: "Retargeting - Cart", status: "active" as const, impressions: 56000, clicks: 4480, ctr: 8.0, conversions: 268, spend: 3800 },
  { name: "Holiday Sale 2025", status: "completed" as const, impressions: 224000, clicks: 11200, ctr: 5.0, conversions: 542, spend: 12400 },
  { name: "Newsletter Promo", status: "paused" as const, impressions: 34000, clicks: 1700, ctr: 5.0, conversions: 89, spend: 2200 },
  { name: "Partner Co-Brand", status: "active" as const, impressions: 67000, clicks: 2680, ctr: 4.0, conversions: 128, spend: 4800 },
];

const campaignStatusVariant: Record<string, "success" | "default" | "secondary"> = {
  active: "success",
  paused: "default",
  completed: "secondary",
};

// ── Conversion Funnel ──

const conversionFunnel = [
  { stage: "Visitors", count: 92400, pct: 100 },
  { stage: "Leads", count: 3847, pct: 4.2 },
  { stage: "Qualified", count: 1284, pct: 1.4 },
  { stage: "Customers", count: 412, pct: 0.4 },
];

const funnelColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
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
          {entry.name}: {entry.value.toLocaleString()}
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
        {payload[0].value}% of traffic
      </p>
    </div>
  );
}

// ── Page ──

export default function MarketingPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor campaign performance, lead generation, and channel ROI.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {marketingStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const invertTrend = "invertTrend" in stat && stat.invertTrend;
          const isGood = invertTrend ? !isPositive : isPositive;
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
                        id={`mkt-stat-${i}`}
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
                      fill={`url(#mkt-stat-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Campaign Performance + Channel Mix */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Campaign Performance */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Campaign Performance
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Impressions and clicks over the last 6 months
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={campaignPerformanceData}>
                <defs>
                  <linearGradient
                    id="mkt-impressions-grad"
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
                  <linearGradient
                    id="mkt-clicks-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.2}
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
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#mkt-impressions-grad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "var(--background)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#mkt-clicks-grad)"
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

        {/* Channel Mix Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Channel Mix
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Traffic distribution by channel
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelMixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {channelMixData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">
                    {channelMixTotal}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Total
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {channelMixData.map((item) => (
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

      {/* Row 3: Top Campaigns + Conversion Funnel */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Top Campaigns Table */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Top Campaigns
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Performance metrics for active and recent campaigns
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      Campaign
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Impressions
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground md:table-cell">
                      Clicks
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      CTR
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Conv.
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Spend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCampaigns.map((campaign) => (
                    <tr
                      key={campaign.name}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 text-sm font-medium">
                        {campaign.name}
                      </td>
                      <td className="py-3 text-end">
                        <Badge
                          variant={campaignStatusVariant[campaign.status]}
                          className="capitalize"
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="hidden py-3 text-end text-sm text-muted-foreground sm:table-cell">
                        {campaign.impressions.toLocaleString()}
                      </td>
                      <td className="hidden py-3 text-end text-sm text-muted-foreground md:table-cell">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td
                        className={cn(
                          "py-3 text-end text-sm font-semibold",
                          campaign.ctr >= 5
                            ? "text-success"
                            : campaign.ctr < 4
                              ? "text-muted-foreground"
                              : ""
                        )}
                      >
                        {campaign.ctr}%
                      </td>
                      <td className="hidden py-3 text-end text-sm font-semibold sm:table-cell">
                        {campaign.conversions.toLocaleString()}
                      </td>
                      <td className="py-3 text-end text-sm text-muted-foreground">
                        ${campaign.spend.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Conversion Funnel
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              From visitors to paying customers
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, i) => {
                const widthPct =
                  i === 0
                    ? 100
                    : Math.max(
                        20,
                        Math.round(
                          (stage.count / conversionFunnel[0].count) * 100
                        )
                      );
                return (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {stage.stage}
                      </span>
                      <span className="text-muted-foreground">
                        {stage.count.toLocaleString()}
                        {i > 0 && (
                          <span className="ml-1 text-[10px]">
                            ({stage.pct}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-8 w-full overflow-hidden rounded-lg bg-muted/50">
                      <div
                        className={cn(
                          "flex h-full items-center justify-center rounded-lg transition-all duration-500",
                          funnelColors[i]
                        )}
                        style={{ width: `${widthPct}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">
                          {stage.count.toLocaleString()}
                        </span>
                      </div>
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
