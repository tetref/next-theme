"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { createOrder } from "@dashboardpack/core/lib/data";
import type { OrderStatus } from "@dashboardpack/core/lib/data";
import { toast } from "sonner";

const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
});

type OrderFormValues = z.infer<typeof orderSchema>;

let idCounter = 0;

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function NewOrderPage() {
  const router = useRouter();

  const form = useForm<OrderFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      customerName: "",
      customerEmail: "",
      productName: "",
      amount: undefined,
      status: "pending",
    },
  });

  function onSubmit(values: OrderFormValues) {
    createOrder({
      customerId: `cust-new-${++idCounter}`,
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerInitials: generateInitials(values.customerName),
      productId: `prod-new-${idCounter}`,
      productName: values.productName,
      amount: values.amount,
      status: values.status as OrderStatus,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    toast.success("Order created successfully!");
    router.push("/orders");
  }

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="New Order"
          description="Create a new customer order."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Orders", href: "/orders" },
            { label: "New Order" },
          ]}
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Emma Wilson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. emma@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Pro Dashboard License"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Create Order</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/orders")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
