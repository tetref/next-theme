"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { DatePicker } from "@dashboardpack/core/components/ui/date-picker";
import { Combobox } from "@dashboardpack/core/components/ui/combobox";
import { MultiSelect } from "@dashboardpack/core/components/ui/multi-select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@dashboardpack/core/components/ui/input-otp";
import { ColorPicker } from "@dashboardpack/core/components/ui/color-picker";
import { PhoneInput } from "@dashboardpack/core/components/ui/phone-input";
import { FileUpload, FileUploadList } from "@dashboardpack/core/components/ui/file-upload";
import { toast } from "sonner";

const frameworkOptions = [
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "gatsby", label: "Gatsby" },
];

const tagOptions = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "graphql", label: "GraphQL" },
  { value: "prisma", label: "Prisma" },
  { value: "docker", label: "Docker" },
  { value: "testing", label: "Testing" },
  { value: "ci-cd", label: "CI/CD" },
];

const formSchema = z.object({
  date: z.date({ error: "Please select a date" }),
  framework: z.string().min(1, "Please select a framework"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  otp: z.string().length(6, "Please enter a 6-digit code"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  phone: z.string().min(5, "Please enter a phone number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormsPage() {
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      date: undefined,
      framework: "",
      tags: [],
      otp: "",
      color: "#3b82f6",
      phone: "",
      name: "",
    },
  });

  function onSubmit(values: FormValues) {
    toast.success("Form submitted!", {
      description: (
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-foreground/5 p-2 text-xs">
          {JSON.stringify({ ...values, files: files.map((f) => f.name) }, null, 2)}
        </pre>
      ),
    });
  }

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Form Components"
          description="Advanced form elements showcase with validation."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Forms" },
          ]}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Date Selection</CardTitle>
              <CardDescription>
                Calendar-based date picker with popover trigger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select a date"
                        />
                      </FormControl>
                      <FormDescription>
                        Single date selection with calendar UI
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Standard text input for comparison
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selection Components */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Selection Components</CardTitle>
              <CardDescription>
                Searchable dropdowns for single and multiple selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework</FormLabel>
                      <FormControl>
                        <Combobox
                          options={frameworkOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select framework..."
                          searchPlaceholder="Search frameworks..."
                        />
                      </FormControl>
                      <FormDescription>
                        Searchable single-select combobox
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={tagOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select tags..."
                          maxDisplay={2}
                        />
                      </FormControl>
                      <FormDescription>
                        Badge-based multi-select with search
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialized Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Specialized Inputs</CardTitle>
              <CardDescription>
                Purpose-built input components for specific data types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="(555) 123-4567"
                        />
                      </FormControl>
                      <FormDescription>
                        Formatted input with country selector
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Color picker with presets and hex input
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      6-digit OTP input with grouped slots
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Upload</CardTitle>
              <CardDescription>
                Drag-and-drop file upload zone with file list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                value={files}
                onValueChange={setFiles}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                  "application/pdf": [".pdf"],
                }}
                maxSize={5 * 1024 * 1024}
                maxFiles={5}
              >
                <FileUploadList />
              </FileUpload>
              <p className="mt-2 text-xs text-muted-foreground">
                Images & PDFs, max 5MB each, up to 5 files
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <Button type="submit">Submit Form</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setFiles([]);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
