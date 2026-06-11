"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 9,
    annualPrice: 7,
    description: "For individuals and small projects",
    features: [
      "5 projects",
      "Basic analytics",
      "Email support",
      "1 GB storage",
      "API access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "For growing teams and businesses",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10 GB storage",
      "API access",
      "Custom branding",
      "Team collaboration",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "For large organizations",
    features: [
      "Unlimited everything",
      "Dedicated support",
      "SSO & SAML",
      "Unlimited storage",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the plan that&apos;s right for you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm transition-colors",
              !annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={annual}
            onCheckedChange={setAnnual}
          />
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm transition-colors",
              annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Annual
          </Label>
          {annual && (
            <Badge variant="success" className="ms-1">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.popular && "border-primary shadow-md"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {plan.name}
                  </CardTitle>
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">
                    {annual ? "/mo, billed annually" : "/month"}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="mt-6 w-full"
                  onClick={() =>
                    toast.info("Demo mode — no backend connected")
                  }
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
