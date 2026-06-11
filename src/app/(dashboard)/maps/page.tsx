"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { Skeleton } from "@dashboardpack/core/components/ui/skeleton";
import { cn } from "@dashboardpack/core/lib/utils";
import { MapPin } from "lucide-react";

/* ---------- Location data ---------- */

const locations = [
  {
    name: "New York HQ",
    address: "350 5th Ave, New York, NY",
    lat: 40.7484,
    lng: -73.9857,
    status: "active" as const,
    popup: "New York HQ — Main Office",
  },
  {
    name: "London Office",
    address: "1 Canada Square, London",
    lat: 51.5049,
    lng: -0.0196,
    status: "active" as const,
    popup: "London Office — EMEA Hub",
  },
  {
    name: "Tokyo Branch",
    address: "1-1 Marunouchi, Chiyoda",
    lat: 35.6812,
    lng: 139.7671,
    status: "active" as const,
    popup: "Tokyo Branch — APAC Hub",
  },
  {
    name: "Sydney Data Center",
    address: "1 Macquarie Place, Sydney",
    lat: -33.8611,
    lng: 151.2099,
    status: "maintenance" as const,
    popup: "Sydney Data Center — Under Maintenance",
  },
  {
    name: "Berlin Satellite",
    address: "Friedrichstr. 68, Berlin",
    lat: 52.5235,
    lng: 13.3882,
    status: "active" as const,
    popup: "Berlin Satellite — EU Engineering",
  },
  {
    name: "Sao Paulo Office",
    address: "Av. Paulista, 1578, Sao Paulo",
    lat: -23.5613,
    lng: -46.6558,
    status: "inactive" as const,
    popup: "Sao Paulo Office — Opening Soon",
  },
];

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-500" },
  maintenance: { label: "Maintenance", color: "bg-amber-500" },
  inactive: { label: "Inactive", color: "bg-red-500" },
};

/* ---------- Map loading skeleton ---------- */

function MapSkeleton({ height = "h-[500px]" }: { height?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-muted", height)}>
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <MapPin className="h-8 w-8 animate-pulse" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

/* ---------- Dynamically imported map component ---------- */

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const LeafletMapSmall = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <MapSkeleton height="h-[400px]" />,
});

/* ---------- Page ---------- */

export default function MapsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <PageHeader
          title="Maps"
          description="Interactive maps with Leaflet."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Maps" },
          ]}
        />
      </div>

      {/* Row 1: Full-width main map */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Global Offices
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Overview of all company locations worldwide
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[500px] overflow-hidden rounded-lg">
            <LeafletMap
              center={[20, 0]}
              zoom={2}
              markers={locations.map((loc) => ({
                position: [loc.lat, loc.lng] as [number, number],
                popup: loc.popup,
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Row 2: 8-col map + 4-col location list */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Regional map */}
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              North America
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Regional view of US headquarters
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[400px] overflow-hidden rounded-lg">
              <LeafletMapSmall
                center={[40.7128, -74.006]}
                zoom={12}
                markers={[
                  {
                    position: [40.7484, -73.9857],
                    popup: "New York HQ — Main Office",
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location list */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Locations
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              All registered office locations
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {locations.map((loc) => {
                const status = statusConfig[loc.status];
                return (
                  <div
                    key={loc.name}
                    className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={cn(
                        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                        status.color
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {loc.name}
                        </p>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] px-1.5 py-0"
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {loc.address}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground/70">
                        {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                      </p>
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
