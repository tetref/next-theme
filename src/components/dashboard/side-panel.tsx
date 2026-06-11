"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { trafficData, goalsData } from "@dashboardpack/core/lib/data";

interface TooltipPayloadEntry {
  name: string;
  value: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-sm font-semibold">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
    </div>
  );
}

export function SidePanel() {
  return (
    <div className="col-span-full flex flex-col gap-4 xl:col-span-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Traffic Sources</CardTitle>
          <p className="text-xs text-muted-foreground">Where your visitors come from</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {trafficData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">284K</span>
                <span className="text-[10px] text-muted-foreground">Visits</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {trafficData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Goals</CardTitle>
          <p className="text-xs text-muted-foreground">Track progress toward targets</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {goalsData.map((goal) => {
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{goal.label}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} indicatorClassName={goal.color} />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {typeof goal.current === "number" && goal.current > 100
                      ? goal.current.toLocaleString()
                      : goal.current}
                  </span>
                  <span>
                    Target:{" "}
                    {typeof goal.target === "number" && goal.target > 100
                      ? goal.target.toLocaleString()
                      : goal.target}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
