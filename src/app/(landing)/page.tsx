"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Diamond,
  Sun,
  Moon,
  Smartphone,
  Accessibility,
  Globe,
  BarChart3,
  Command,
  Check,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { cn } from "@dashboardpack/core/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Dashboards", href: "#dashboards" },
  { label: "Pricing", href: "#pricing" },
];

const STATS = [
  { value: "50+", label: "Pages" },
  { value: "10", label: "Chart Types" },
  { value: "6", label: "Dashboards" },
  { value: "3", label: "Languages" },
];

const FEATURES = [
  {
    icon: Sun,
    iconAlt: Moon,
    title: "Dark Mode",
    description: "Dark, light, and system theme support out of the box.",
  },
  {
    icon: Smartphone,
    title: "Responsive",
    description: "Mobile-first responsive design that works on every device.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "WCAG compliant with keyboard navigation and screen reader support.",
  },
  {
    icon: Globe,
    title: "i18n Ready",
    description: "Multi-language support with English, German, and French included.",
  },
  {
    icon: BarChart3,
    title: "Charts & Data",
    description: "10+ chart types powered by Recharts for rich data visualization.",
  },
  {
    icon: Command,
    title: "Command Palette",
    description: "Cmd+K quick navigation to find anything in your dashboard.",
  },
];

const DASHBOARDS = [
  {
    name: "Overview",
    href: "/dashboard",
    description: "A bird's-eye view of your key metrics, activity, and recent orders.",
  },
  {
    name: "Analytics",
    href: "/analytics",
    description: "Deep-dive analytics with traffic sources, funnels, and user behavior.",
  },
  {
    name: "eCommerce",
    href: "/ecommerce",
    description: "Revenue tracking, product performance, and order management.",
  },
  {
    name: "CRM",
    href: "/crm",
    description: "Customer pipeline, deal stages, and contact management at a glance.",
  },
  {
    name: "SaaS",
    href: "/saas",
    description: "MRR, churn rate, active users, and subscription lifecycle metrics.",
  },
];

interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "For personal projects and small teams getting started.",
    features: [
      "1 dashboard variant",
      "All UI components",
      "Dark mode",
      "Community support",
      "6 months updates",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    annualPrice: 64,
    description: "For growing teams that need the full feature set.",
    features: [
      "All 6 dashboard variants",
      "All UI components",
      "Dark mode + theming",
      "i18n support",
      "Priority support",
      "12 months updates",
      "Figma design files",
    ],
    highlighted: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: 199,
    annualPrice: 164,
    description: "For large organizations with custom requirements.",
    features: [
      "Everything in Pro",
      "Custom branding",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Lifetime updates",
      "Source code access",
      "Multi-team license",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "/docs" },
  ],
  Resources: [
    { label: "Support", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Header                                                                     */
/* -------------------------------------------------------------------------- */

function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Diamond className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Zenith</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background/95 backdrop-blur-lg md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      {/* Dot pattern background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.45 0 0 / 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Gradient fade at edges */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs font-medium">
            Built with Next.js 16 + React 19 + Tailwind v4
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The Admin Dashboard You&apos;ll Actually{" "}
            <span className="text-muted-foreground">Enjoy Using</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Built with Next.js 16, React 19, and Tailwind CSS v4. Achromatic design
            that lets your features speak.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-foreground/5">
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-background/80 text-[10px] text-muted-foreground">
                zenith-dashboard.pages.dev/dashboard
              </div>
            </div>

            {/* Mockup content */}
            <div className="flex">
              {/* Mini sidebar */}
              <div className="hidden w-48 shrink-0 border-r bg-muted/30 p-3 sm:block">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                    <Diamond className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold">Zenith</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Analytics", active: false },
                    { label: "eCommerce", active: false },
                    { label: "CRM", active: false },
                    { label: "SaaS", active: false },
                    { label: "Orders", active: false },
                    { label: "Products", active: false },
                    { label: "Customers", active: false },
                    { label: "Kanban", active: false },
                    { label: "Calendar", active: false },
                    { label: "AI Chat", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-md px-2 py-1 text-[10px]",
                        item.active
                          ? "bg-primary/10 font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-4 sm:p-5">
                {/* Title row */}
                <div className="mb-4">
                  <div className="text-sm font-bold">Dashboard Overview</div>
                  <div className="text-[10px] text-muted-foreground">Welcome back, Alex</div>
                </div>

                {/* Stat cards */}
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "Revenue", value: "$45.2k", change: "+12.5%", up: true, color: "bg-chart-1" },
                    { label: "Users", value: "2,340", change: "+8.1%", up: true, color: "bg-chart-2" },
                    { label: "Orders", value: "1,203", change: "+23%", up: true, color: "bg-chart-3" },
                    { label: "Conversion", value: "3.2%", change: "-0.4%", up: false, color: "bg-chart-4" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border bg-card p-2.5">
                      <div className="text-[9px] text-muted-foreground">{stat.label}</div>
                      <div className="mt-0.5 text-base font-bold">{stat.value}</div>
                      <div className="mt-0.5 flex items-center gap-1">
                        {stat.up ? (
                          <TrendingUp className="h-2.5 w-2.5 text-success" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5 text-destructive" />
                        )}
                        <span className={cn("text-[9px]", stat.up ? "text-success" : "text-destructive")}>{stat.change}</span>
                      </div>
                      {/* Mini sparkline bar */}
                      <div className="mt-1.5 flex items-end gap-px">
                        {[40, 55, 35, 65, 45, 75, 60, 80, 70, 90, 85, 95].map((h, i) => (
                          <div
                            key={i}
                            className={cn("w-full rounded-sm", stat.color)}
                            style={{ height: `${h * 0.14}px`, opacity: 0.15 + (i / 12) * 0.6 }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart area + side panel */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {/* Revenue chart */}
                  <div className="col-span-2 rounded-lg border bg-card p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[10px] font-semibold">Revenue Trends</div>
                      <div className="flex gap-1">
                        {["7D", "30D", "90D"].map((period) => (
                          <div
                            key={period}
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[8px]",
                              period === "30D"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {period}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* SVG area chart */}
                    <div className="relative h-28 overflow-hidden">
                      <svg viewBox="0 0 300 96" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="zenith-g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.205 0 0)" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="oklch(0.205 0 0)" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="zenith-g2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Revenue bars (background) */}
                        {[52, 38, 65, 45, 70, 55, 80, 60, 75, 48, 85, 72, 90, 68, 78].map((h, i) => (
                          <rect
                            key={i}
                            x={i * 20 + 2}
                            y={96 - h}
                            width="16"
                            height={h}
                            rx="2"
                            fill="oklch(0.205 0 0)"
                            opacity={0.06}
                          />
                        ))}
                        {/* Revenue line */}
                        <path
                          d="M10,52 C30,40 50,58 75,38 C100,18 115,42 140,30 C165,18 180,25 205,15 C230,5 250,20 275,8 L300,12"
                          fill="none"
                          stroke="oklch(0.205 0 0)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Profit line */}
                        <path
                          d="M10,68 C30,62 50,70 75,58 C100,46 115,56 140,50 C165,42 180,48 205,38 C230,30 250,36 275,28 L300,32"
                          fill="url(#zenith-g2)"
                        />
                        <path
                          d="M10,68 C30,62 50,70 75,58 C100,46 115,56 140,50 C165,42 180,48 205,38 C230,30 250,36 275,28 L300,32"
                          fill="none"
                          stroke="oklch(0.6 0.118 184.704)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeDasharray="4 3"
                        />
                        {/* X-axis grid lines */}
                        {[0, 1, 2, 3].map((i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={24 * i + 24}
                            x2="300"
                            y2={24 * i + 24}
                            stroke="oklch(0.45 0 0)"
                            strokeWidth="0.5"
                            opacity="0.1"
                          />
                        ))}
                      </svg>
                      {/* X-axis labels */}
                      <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[8px] text-muted-foreground/50">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-foreground" />
                        <span className="text-[9px] text-muted-foreground">Revenue</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-chart-2" />
                        <span className="text-[9px] text-muted-foreground">Profit</span>
                      </div>
                    </div>
                  </div>

                  {/* Side panel — donut + recent */}
                  <div className="space-y-2">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="mb-2 text-[10px] font-semibold">Traffic Sources</div>
                      <div className="mx-auto flex h-20 w-20 items-center justify-center">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.646 0.222 41.116)" strokeWidth="4" strokeDasharray="33 55" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.6 0.118 184.704)" strokeWidth="4" strokeDasharray="22 66" strokeDashoffset="-33" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.398 0.07 227.392)" strokeWidth="4" strokeDasharray="17.6 70.4" strokeDashoffset="-55" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.828 0.189 84.429)" strokeWidth="4" strokeDasharray="15.4 72.6" strokeDashoffset="-72.6" />
                        </svg>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {[
                          { label: "Direct", color: "bg-chart-1" },
                          { label: "Organic", color: "bg-chart-2" },
                          { label: "Social", color: "bg-chart-3" },
                          { label: "Referral", color: "bg-chart-4" },
                        ].map((d) => (
                          <div key={d.label} className="flex items-center gap-1">
                            <div className={cn("h-1.5 w-1.5 rounded-full", d.color)} />
                            <span className="text-[8px] text-muted-foreground">{d.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent activity mini list */}
                    <div className="rounded-lg border bg-card p-3">
                      <div className="mb-2 text-[10px] font-semibold">Recent Orders</div>
                      <div className="space-y-1.5">
                        {[
                          { id: "#4021", amount: "$240", status: "Completed" },
                          { id: "#4020", amount: "$185", status: "Pending" },
                          { id: "#4019", amount: "$320", status: "Completed" },
                        ].map((order) => (
                          <div key={order.id} className="flex items-center justify-between">
                            <span className="text-[9px] font-medium">{order.id}</span>
                            <span className="text-[9px] text-muted-foreground">{order.amount}</span>
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-0.5 text-[7px] font-medium",
                                order.status === "Completed"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats Bar                                                                  */
/* -------------------------------------------------------------------------- */

function StatsBar() {
  return (
    <section className="border-y bg-muted/40 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features Grid                                                              */
/* -------------------------------------------------------------------------- */

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete toolkit for building modern admin dashboards, without
            the complexity.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-transparent bg-muted/40 transition-colors hover:border-border hover:bg-muted/60"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboards Showcase                                                        */
/* -------------------------------------------------------------------------- */

const DASHBOARD_GRADIENTS = [
  "from-primary/5 to-primary/10",
  "from-chart-1/5 to-chart-1/10",
  "from-chart-2/5 to-chart-2/10",
  "from-chart-3/5 to-chart-3/10",
  "from-chart-4/5 to-chart-4/10",
];

function DashboardsSection() {
  return (
    <section
      id="dashboards"
      className="scroll-mt-20 border-t bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            5 Dashboard Variants, One Codebase
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Purpose-built layouts for every use case, all sharing the same
            component library and design system.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARDS.map((dashboard, i) => (
            <Link key={dashboard.name} href={dashboard.href} className="group">
              <Card
                className={cn(
                  "relative h-full overflow-hidden border-transparent transition-all group-hover:border-border group-hover:shadow-md",
                  i >= 3 && "sm:col-span-1 lg:col-span-1"
                )}
              >
                {/* Gradient accent strip */}
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    DASHBOARD_GRADIENTS[i]
                  )}
                />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-foreground/80",
                        DASHBOARD_GRADIENTS[i]
                      )}
                    >
                      {dashboard.name.charAt(0)}
                    </div>
                    <CardTitle className="text-base">{dashboard.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {dashboard.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                    */
/* -------------------------------------------------------------------------- */

function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              aria-label="Toggle annual billing"
            />
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
            </span>
            {annual && (
              <Badge variant="secondary" className="text-xs">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted
                    ? "border-primary shadow-lg"
                    : "border-border"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1 text-xs">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-8 w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Diamond className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">Zenith</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A clean, minimal admin dashboard built with Next.js, shadcn/ui,
              and Tailwind CSS v4.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold">{heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Zenith. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="scroll-smooth">
      <StickyHeader />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <DashboardsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
