"use client";

import React from "react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { statsData } from "@dashboardpack/core/lib/data";

const iconMap = {
  revenue: { icon: DollarSign, color: "text-chart-1", bg: "bg-chart-1/10", stroke: "var(--chart-1)" },
  users: { icon: Users, color: "text-chart-2", bg: "bg-chart-2/10", stroke: "var(--chart-2)" },
  orders: { icon: ShoppingCart, color: "text-chart-3", bg: "bg-chart-3/10", stroke: "var(--chart-3)" },
  views: { icon: Eye, color: "text-chart-4", bg: "bg-chart-4/10", stroke: "var(--chart-4)" },
};

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statsData.map((stat) => {
        const { icon: Icon, color, bg, stroke } = iconMap[stat.iconType];
        const isPositive = stat.change > 0;
        const chartData = stat.sparkline.map((v) => ({ v }));

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20"
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
                    <span className="text-xs text-muted-foreground">
                      {stat.changeLabel}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
              </div>
            </CardContent>
            {/* Sparkline chart pinned to bottom edge */}
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${stat.iconType}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stroke} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={stroke}
                    strokeWidth={1.5}
                    fill={`url(#gradient-${stat.iconType})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
