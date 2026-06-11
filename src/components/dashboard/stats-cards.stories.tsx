import type { Meta, StoryObj } from "@storybook/react";
import { StatsCards } from "./stats-cards";

const meta: Meta<typeof StatsCards> = {
  title: "Dashboard/StatsCards",
  component: StatsCards,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StatsCards>;

export const Default: Story = {
  render: () => <StatsCards />,
};
