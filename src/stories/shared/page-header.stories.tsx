import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Download } from "lucide-react";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { Button } from "@dashboardpack/core/components/ui/button";

const meta: Meta<typeof PageHeader> = {
  title: "Shared/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Dashboard",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Orders",
    description: "Manage and track all customer orders in one place.",
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: "Order Details",
    description: "View and manage this order.",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders", href: "/orders" },
      { label: "Order #1234" },
    ],
  },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader
      title="Products"
      description="Manage your product catalog."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products" },
      ]}
    >
      <Button variant="outline" size="sm">
        <Download className="size-4" />
        Export
      </Button>
      <Button size="sm">
        <Plus className="size-4" />
        Add Product
      </Button>
    </PageHeader>
  ),
};

export const TitleOnly: Story = {
  args: {
    title: "Settings",
  },
};
