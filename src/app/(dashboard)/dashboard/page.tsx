"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SidePanel } from "@/components/dashboard/side-panel";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { cn } from "@dashboardpack/core/lib/utils";

export default function DashboardPage() {
  const t = useTranslations();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait one frame so Recharts ResponsiveContainer can measure,
    // then fade everything in together — no progressive popping.
    requestAnimationFrame(() => setHydrated(true));
  }, []);

  return (
    <div
      className={cn(
        "transition-opacity duration-300 ease-out",
        hydrated ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.welcome")}
        </p>
      </div>

      {/* Stats row */}
      <StatsCards />

      {/* Charts + Side panel row */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <RevenueChart />
        <SidePanel />
      </div>

      {/* Orders + Activity row */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <RecentOrders />
        <ActivityFeed />
      </div>
    </div>
  );
}
