"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import {
  AreaChart,
  Area,
  Line,
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
  FolderKanban,
  ListChecks,
  CheckCircle2,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";

// ── Stat Card Data ──

const pmStats = [
  {
    title: "Total Projects",
    value: "24",
    change: 4.2,
    icon: FolderKanban,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    title: "Active Tasks",
    value: "156",
    change: 12.8,
    icon: ListChecks,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    title: "Completed",
    value: "89",
    change: 8.3,
    icon: CheckCircle2,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    title: "Team Members",
    value: "12",
    change: -2.0,
    icon: Users,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

// ── Sprint Burndown Data (10 days) ──

const sprintBurndownData = [
  { day: "Day 1", ideal: 80, actual: 80 },
  { day: "Day 2", ideal: 72, actual: 76 },
  { day: "Day 3", ideal: 64, actual: 70 },
  { day: "Day 4", ideal: 56, actual: 62 },
  { day: "Day 5", ideal: 48, actual: 55 },
  { day: "Day 6", ideal: 40, actual: 46 },
  { day: "Day 7", ideal: 32, actual: 38 },
  { day: "Day 8", ideal: 24, actual: 28 },
  { day: "Day 9", ideal: 16, actual: 18 },
  { day: "Day 10", ideal: 8, actual: 12 },
];

// ── Task Distribution ──

const taskDistributionData = [
  { name: "Backlog", value: 42, fill: "var(--chart-4)" },
  { name: "In Progress", value: 38, fill: "var(--chart-1)" },
  { name: "Review", value: 24, fill: "var(--chart-2)" },
  { name: "Done", value: 52, fill: "var(--chart-3)" },
];

const taskDistributionTotal = taskDistributionData.reduce(
  (sum, d) => sum + d.value,
  0
);

// ── Team Workload ──

const teamWorkload = [
  { name: "Sarah Chen", initials: "SC", role: "Lead Developer", assigned: 14, completed: 11, status: "on-track" as const },
  { name: "Marcus Johnson", initials: "MJ", role: "UI Designer", assigned: 12, completed: 10, status: "ahead" as const },
  { name: "Priya Patel", initials: "PP", role: "Backend Dev", assigned: 16, completed: 9, status: "at-risk" as const },
  { name: "Alex Rivera", initials: "AR", role: "QA Engineer", assigned: 10, completed: 8, status: "on-track" as const },
  { name: "Emma Larsson", initials: "EL", role: "Full Stack Dev", assigned: 13, completed: 12, status: "ahead" as const },
];

const statusVariant: Record<string, "success" | "default" | "destructive"> = {
  "on-track": "default",
  "ahead": "success",
  "at-risk": "destructive",
};

const statusLabel: Record<string, string> = {
  "on-track": "On Track",
  "ahead": "Ahead",
  "at-risk": "At Risk",
};

// ── Upcoming Deadlines ──

const upcomingDeadlines = [
  { project: "Mobile App Redesign", dueDate: "Feb 28", daysRemaining: 2 },
  { project: "API Integration v2", dueDate: "Mar 3", daysRemaining: 5 },
  { project: "Dashboard Analytics", dueDate: "Mar 5", daysRemaining: 7 },
  { project: "User Auth Module", dueDate: "Mar 12", daysRemaining: 14 },
  { project: "Payment Gateway", dueDate: "Mar 18", daysRemaining: 20 },
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
          {entry.name}: {entry.value} pts
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
        {payload[0].value} tasks
      </p>
    </div>
  );
}

// ── Page ──

export default function ProjectManagementPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track sprints, tasks, and team workload across all projects.
          </p>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pmStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;

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
            </Card>
          );
        })}
      </div>

      {/* Row 2: Sprint Burndown + Task Distribution */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Sprint Burndown Chart */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Sprint Burndown
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Story points remaining vs ideal trajectory
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={sprintBurndownData}>
                <defs>
                  <linearGradient
                    id="pm-actual-grad"
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
                  dataKey="day"
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
                  label={{
                    value: "Story Points",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "var(--muted-foreground)", fontSize: 11 },
                    offset: 10,
                  }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="linear"
                  dataKey="ideal"
                  name="Ideal"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#pm-actual-grad)"
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

        {/* Task Distribution Donut */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Task Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Current status of all tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {taskDistributionData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">
                    {taskDistributionTotal}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Tasks
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {taskDistributionData.map((item) => (
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

      {/* Row 3: Team Workload + Upcoming Deadlines */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Team Workload Table */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Team Workload
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Task assignments and completion progress
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-start text-xs font-medium text-muted-foreground">
                      Member
                    </th>
                    <th className="hidden pb-3 text-start text-xs font-medium text-muted-foreground sm:table-cell">
                      Role
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Assigned
                    </th>
                    <th className="hidden pb-3 text-end text-xs font-medium text-muted-foreground sm:table-cell">
                      Completed
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Progress
                    </th>
                    <th className="pb-3 text-end text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamWorkload.map((member) => {
                    const pct = Math.round(
                      (member.completed / member.assigned) * 100
                    );
                    return (
                      <tr
                        key={member.name}
                        className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-[11px] font-bold">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="hidden py-3 text-sm text-muted-foreground sm:table-cell">
                          {member.role}
                        </td>
                        <td className="py-3 text-end text-sm font-semibold">
                          {member.assigned}
                        </td>
                        <td className="hidden py-3 text-end text-sm text-muted-foreground sm:table-cell">
                          {member.completed}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={pct}
                              className="h-1.5 w-16"
                              indicatorClassName={
                                member.status === "at-risk"
                                  ? "bg-destructive"
                                  : member.status === "ahead"
                                    ? "bg-success"
                                    : "bg-chart-1"
                              }
                            />
                            <span className="w-8 text-end text-xs text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-end">
                          <Badge variant={statusVariant[member.status]}>
                            {statusLabel[member.status]}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Upcoming Deadlines
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Projects nearing their due dates
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((item) => (
                <div
                  key={item.project}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.project}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.dueDate}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.daysRemaining < 3
                        ? "destructive"
                        : item.daysRemaining < 7
                          ? "warning"
                          : "success"
                    }
                  >
                    {item.daysRemaining}d left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
