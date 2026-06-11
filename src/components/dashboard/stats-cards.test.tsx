import { render, screen } from "@testing-library/react";
import { StatsCards } from "@/components/dashboard/stats-cards";

// Mock recharts to avoid SVG rendering in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Area: () => null,
}));

describe("StatsCards", () => {
  it("renders all 4 stat cards", () => {
    render(<StatsCards />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("Page Views")).toBeInTheDocument();
  });

  it("displays stat values", () => {
    render(<StatsCards />);
    expect(screen.getByText("$48,295")).toBeInTheDocument();
    expect(screen.getByText("2,847")).toBeInTheDocument();
    expect(screen.getByText("1,432")).toBeInTheDocument();
    expect(screen.getByText("284K")).toBeInTheDocument();
  });

  it("shows trend indicators", () => {
    render(<StatsCards />);
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("-3.1%")).toBeInTheDocument();
  });
});
