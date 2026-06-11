"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Star,
  MessageSquare,
  UserPlus,
  Upload,
  Settings,
  Package,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Mail,
  Calendar,
  FileText,
  Heart,
} from "lucide-react";

// ── Section Header ──

function SectionHeader({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <div
      className="mt-10 mb-4 first:mt-0"
      style={{
        animationDelay: `${delay}ms`,
        animation: "slide-in-up 0.4s ease-out backwards",
      }}
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

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
      {label && (
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
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
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════
// SECTION 1: Statistics Cards Data
// ══════════════════════════════════════════════

const simpleStats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: 12.5,
    icon: DollarSign,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    title: "New Customers",
    value: "2,350",
    change: 8.2,
    icon: Users,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    title: "Active Orders",
    value: "1,247",
    change: -3.1,
    icon: ShoppingCart,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: 0.8,
    icon: Activity,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

const sparklineData = [
  [32, 35, 33, 37, 38, 40, 39, 42, 44, 45, 47, 48],
  [18, 20, 19, 22, 23, 21, 24, 25, 24, 26, 27, 28],
  [42, 40, 41, 38, 37, 39, 36, 35, 34, 34, 33, 32],
  [28, 30, 29, 31, 30, 33, 32, 34, 33, 35, 34, 35],
];

const progressTargets = [
  { current: 45231, target: 60000 },
  { current: 2350, target: 3000 },
  { current: 1247, target: 1500 },
  { current: 3.24, target: 5 },
];

// ══════════════════════════════════════════════
// SECTION 2: Profile & User Cards Data
// ══════════════════════════════════════════════

const userProfile = {
  name: "Alexandra Chen",
  initials: "AC",
  role: "Senior Product Designer",
  email: "alex.chen@acme.io",
  projects: 24,
  followers: 1842,
  following: 267,
};

const teamMembers = [
  {
    name: "Jordan Mills",
    initials: "JM",
    role: "Engineering",
    online: true,
  },
  {
    name: "Priya Nakamura",
    initials: "PN",
    role: "Design",
    online: true,
  },
  {
    name: "Carlos Reyes",
    initials: "CR",
    role: "Marketing",
    online: false,
  },
];

const testimonial = {
  quote:
    "This dashboard transformed how we analyze data. The interface is incredibly intuitive and the insights are actionable from day one.",
  name: "Sarah Mitchell",
  initials: "SM",
  company: "Nexora Corp",
  rating: 5,
};

// ══════════════════════════════════════════════
// SECTION 3: Progress & Activity Data
// ══════════════════════════════════════════════

const projectData = {
  name: "Dashboard Redesign",
  description: "Modernize the analytics dashboard with new chart components and improved data visualization.",
  team: [
    { initials: "AC", color: "bg-chart-1" },
    { initials: "JM", color: "bg-chart-2" },
    { initials: "PN", color: "bg-chart-3" },
    { initials: "CR", color: "bg-chart-4" },
  ],
  progress: 68,
  dueDate: "Mar 15, 2026",
};

const timelineItems = [
  {
    title: "New user registered",
    description: "Alexandra Chen joined the team",
    time: "2 min ago",
    color: "bg-chart-1",
  },
  {
    title: "Payment received",
    description: "$2,400 from Nexora Corp",
    time: "15 min ago",
    color: "bg-chart-2",
  },
  {
    title: "Project milestone completed",
    description: "Dashboard v2.0 sprint finished",
    time: "1 hour ago",
    color: "bg-chart-3",
  },
  {
    title: "Server alert resolved",
    description: "CPU usage back to normal",
    time: "3 hours ago",
    color: "bg-chart-4",
  },
  {
    title: "New comment on task",
    description: "Jordan reviewed the PR #142",
    time: "5 hours ago",
    color: "bg-chart-5",
  },
];

// ══════════════════════════════════════════════
// SECTION 4: Chart Cards Data
// ══════════════════════════════════════════════

const barChartData = [
  { month: "Sep", users: 284 },
  { month: "Oct", users: 312 },
  { month: "Nov", users: 298 },
  { month: "Dec", users: 341 },
  { month: "Jan", users: 378 },
  { month: "Feb", users: 356 },
];

const lineChartData = [
  { day: "Mon", value: 186 },
  { day: "Tue", value: 305 },
  { day: "Wed", value: 237 },
  { day: "Thu", value: 273 },
  { day: "Fri", value: 209 },
  { day: "Sat", value: 314 },
  { day: "Sun", value: 280 },
];

const donutData = [
  { name: "Desktop", value: 62, fill: "var(--chart-1)" },
  { name: "Mobile", value: 28, fill: "var(--chart-2)" },
  { name: "Tablet", value: 10, fill: "var(--chart-3)" },
];

const donutTotal = donutData.reduce((sum, d) => sum + d.value, 0);

// ══════════════════════════════════════════════
// SECTION 5: Info & List Cards Data
// ══════════════════════════════════════════════

const quickActions = [
  { label: "Add User", icon: UserPlus, color: "text-chart-1", bg: "bg-chart-1/10" },
  { label: "New Order", icon: Package, color: "text-chart-2", bg: "bg-chart-2/10" },
  { label: "Upload", icon: Upload, color: "text-chart-3", bg: "bg-chart-3/10" },
  { label: "Settings", icon: Settings, color: "text-chart-4", bg: "bg-chart-4/10" },
];

const recentActivity = [
  { icon: Mail, text: "New message from Jordan Mills", time: "2m ago", color: "text-chart-1", bg: "bg-chart-1/10" },
  { icon: ShoppingCart, text: "Order #1842 has been shipped", time: "18m ago", color: "text-chart-2", bg: "bg-chart-2/10" },
  { icon: FileText, text: "Invoice INV-0042 generated", time: "1h ago", color: "text-chart-3", bg: "bg-chart-3/10" },
  { icon: Calendar, text: "Meeting scheduled for tomorrow", time: "3h ago", color: "text-chart-4", bg: "bg-chart-4/10" },
  { icon: Heart, text: "Priya liked your comment", time: "5h ago", color: "text-chart-5", bg: "bg-chart-5/10" },
];

const notifications = [
  {
    icon: Info,
    title: "System Update",
    message: "A new version is available. Update to get the latest features.",
    time: "5m ago",
    severity: "info" as const,
  },
  {
    icon: AlertTriangle,
    title: "Storage Warning",
    message: "You are using 85% of your storage quota.",
    time: "1h ago",
    severity: "warning" as const,
  },
  {
    icon: CheckCircle2,
    title: "Backup Complete",
    message: "Your weekly backup finished successfully.",
    time: "3h ago",
    severity: "success" as const,
  },
];

const severityStyles = {
  info: {
    text: "text-chart-1",
    bg: "bg-chart-1/10",
    badge: "default" as const,
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning/10",
    badge: "warning" as const,
  },
  success: {
    text: "text-success",
    bg: "bg-success/10",
    badge: "success" as const,
  },
};

// ══════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════

export default function WidgetsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <PageHeader
          title="Widgets"
          description="A collection of reusable card and widget patterns."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Widgets" },
          ]}
        />
      </div>

      {/* ── Section 1: Statistics Cards ── */}
      <SectionHeader
        title="Statistics Cards"
        description="Four variations of metric cards for key performance indicators."
        delay={0}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {simpleStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const chartData = sparklineData[i].map((v) => ({ v }));
          const pct = Math.round(
            (progressTargets[i].current / progressTargets[i].target) * 100
          );

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
                {/* Row 1: Title + Icon */}
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

                {/* Variant-specific bottom section */}
                {i === 0 && (
                  /* Simple Stat: just the change badge (already shown above) */
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">$12,340</span> from last month
                    </p>
                  </div>
                )}
                {i === 1 && (
                  /* Stat with Icon: enhanced display already from the icon circle above */
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Active now</span>
                      <span className="font-semibold text-foreground">847</span>
                    </div>
                  </div>
                )}
                {i === 2 && (
                  /* Stat with Sparkline */
                  <div className="-mx-5 -mb-5 mt-3 h-14">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="widget-sparkline"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={`var(--chart-3)`}
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor={`var(--chart-3)`}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={`var(--chart-3)`}
                          strokeWidth={1.5}
                          fill="url(#widget-sparkline)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {i === 3 && (
                  /* Stat with Progress */
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target: 5%</span>
                      <span className="font-semibold text-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} indicatorClassName="bg-chart-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Section 2: Profile & User Cards ── */}
      <SectionHeader
        title="Profile & User Cards"
        description="Cards for user profiles, team members, and testimonials."
        delay={100}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* User Profile Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "200ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg font-bold bg-chart-1/10 text-chart-1">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-base font-semibold">{userProfile.name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{userProfile.email}</p>

              <div className="mt-5 flex w-full items-center justify-around border-t border-border/50 pt-5">
                <div className="text-center">
                  <p className="text-lg font-bold">{userProfile.projects}</p>
                  <p className="text-[11px] text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">
                    {userProfile.followers.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{userProfile.following}</p>
                  <p className="text-[11px] text-muted-foreground">Following</p>
                </div>
              </div>

              <div className="mt-5 flex w-full gap-3">
                <Button className="flex-1" size="sm">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Member Cards */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "280ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs font-bold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                      member.online ? "bg-success" : "bg-muted-foreground/40"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <Badge variant="secondary" className="mt-0.5 text-[10px]">
                    {member.role}
                  </Badge>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    member.online ? "text-success" : "text-muted-foreground"
                  )}
                >
                  {member.online ? "Online" : "Offline"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Testimonial Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "360ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs font-bold bg-chart-2/10 text-chart-2">
                  {testimonial.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.company}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 3: Progress & Activity ── */}
      <SectionHeader
        title="Progress & Activity"
        description="Track project progress and recent activity in your workspace."
        delay={200}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Project Progress Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "400ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {projectData.name}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {projectData.description}
                </p>
              </div>
              <Badge variant="default">{projectData.progress}%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Team Avatars */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {projectData.team.map((member) => (
                  <div
                    key={member.initials}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white",
                      member.color
                    )}
                  >
                    {member.initials}
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                  +3
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Due {projectData.dueDate}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Progress</span>
                <span className="text-muted-foreground">
                  {projectData.progress}%
                </span>
              </div>
              <Progress
                value={projectData.progress}
                indicatorClassName="bg-chart-1"
              />
            </div>

            {/* Milestones */}
            <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs">
              <span className="text-muted-foreground">8 of 12 tasks completed</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "480ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Activity Timeline
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Recent events in your workspace
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {timelineItems.map((item, i) => (
                <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* Vertical line */}
                  {i < timelineItems.length - 1 && (
                    <div className="absolute left-[9px] top-5 h-full w-px bg-border" />
                  )}
                  {/* Dot */}
                  <div
                    className={cn(
                      "relative z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-background",
                      item.color
                    )}
                  />
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 4: Chart Cards ── */}
      <SectionHeader
        title="Chart Cards"
        description="Compact chart widgets for at-a-glance data visualization."
        delay={300}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Mini Bar Chart Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "560ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  User Growth
                </CardTitle>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </div>
              <Badge variant="success" className="text-[10px]">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.4%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barChartData} barCategoryGap="20%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dy={4}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Bar
                  dataKey="users"
                  name="Users"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mini Line Chart Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "640ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Page Views
                </CardTitle>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <p className="text-xl font-bold tracking-tight">1,804</p>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient
                    id="widget-line-grad"
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
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dy={4}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Views"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#widget-line-grad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "var(--background)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mini Donut Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "720ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Traffic Sources
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Sessions by device type
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-bold">{donutTotal}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {donutData.map((item) => (
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

      {/* ── Section 5: Info & List Cards ── */}
      <SectionHeader
        title="Info & List Cards"
        description="Quick actions, activity lists, and notification widgets."
        delay={400}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Quick Actions Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "800ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 transition-all duration-200 hover:bg-muted/50 hover:border-primary/20 hover:shadow-sm active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        action.bg
                      )}
                    >
                      <ActionIcon className={cn("h-5 w-5", action.color)} />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "880ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        item.bg
                      )}
                    >
                      <ItemIcon className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm">{item.text}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notification Card */}
        <Card
          className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
          style={{
            animationDelay: "960ms",
            animation: "slide-in-up 0.4s ease-out backwards",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              Notifications
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              <Bell className="mr-1 h-3 w-3" />3 new
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notif, i) => {
                const NotifIcon = notif.icon;
                const styles = severityStyles[notif.severity];
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          styles.bg
                        )}
                      >
                        <NotifIcon className={cn("h-4 w-4", styles.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {notif.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {notif.message}
                        </p>
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
