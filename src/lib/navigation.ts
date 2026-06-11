import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  Kanban,
  Calendar,
  ListChecks,
  BookOpen,
  ChartNoAxesCombined,
  UserCog,
  Bot,
  FolderKanban,
  Megaphone,
  Wallet,
  PenLine,
  MapPin,
  LayoutGrid,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  keywords?: string[];
  group: "main" | "system";
}

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "overview"], group: "main" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, keywords: ["charts", "stats", "metrics"], group: "main" },
  { label: "eCommerce", href: "/ecommerce", icon: ShoppingCart, keywords: ["shop", "sales", "store"], group: "main" },
  { label: "CRM", href: "/crm", icon: Users, keywords: ["pipeline", "deals", "leads"], group: "main" },
  { label: "SaaS", href: "/saas", icon: CreditCard, keywords: ["subscription", "mrr", "churn"], group: "main" },
  { label: "Project Mgmt", href: "/project-management", icon: FolderKanban, keywords: ["sprint", "tasks", "burndown", "agile"], group: "main" },
  { label: "Marketing", href: "/marketing", icon: Megaphone, keywords: ["campaigns", "leads", "funnel", "ads"], group: "main" },
  { label: "Finance", href: "/finance", icon: Wallet, keywords: ["revenue", "expenses", "profit", "budget", "cash flow"], group: "main" },
  { label: "Orders", href: "/orders", icon: ShoppingCart, badge: "12", keywords: ["purchases", "transactions"], group: "main" },
  { label: "Products", href: "/products", icon: Package, keywords: ["catalog", "items", "inventory"], group: "main" },
  { label: "Customers", href: "/customers", icon: Users, keywords: ["clients", "users", "people"], group: "main" },
  { label: "Kanban", href: "/kanban", icon: Kanban, keywords: ["board", "tasks", "drag", "drop"], group: "main" },
  { label: "Calendar", href: "/calendar", icon: Calendar, keywords: ["events", "schedule", "dates"], group: "main" },
  { label: "Wizard", href: "/wizard", icon: ListChecks, keywords: ["form", "steps", "multi-step"], group: "main" },
  { label: "AI Chat", href: "/ai-chat", icon: Bot, keywords: ["assistant", "gpt", "claude", "llm", "artificial intelligence"], group: "main" },
  { label: "Editor", href: "/editor", icon: PenLine, keywords: ["rich text", "wysiwyg", "tiptap", "writing"], group: "main" },
  { label: "Maps", href: "/maps", icon: MapPin, keywords: ["leaflet", "locations", "geography", "markers"], group: "main" },
  { label: "Widgets", href: "/widgets", icon: LayoutGrid, keywords: ["cards", "components", "showcase", "ui"], group: "main" },
  { label: "Billing", href: "/billing", icon: CreditCard, keywords: ["payment", "subscription", "plan"], group: "main" },
  { label: "Invoices", href: "/invoices", icon: FileText, keywords: ["bills", "receipts"], group: "main" },
  { label: "Charts", href: "/charts", icon: ChartNoAxesCombined, keywords: ["radar", "treemap", "scatter", "gauge", "graphs"], group: "main" },
  { label: "Documentation", href: "/docs", icon: BookOpen, keywords: ["docs", "guide", "help", "components"], group: "main" },
  { label: "Users", href: "/users", icon: UserCog, keywords: ["team", "members", "roles", "permissions", "rbac"], group: "system" },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: "3", keywords: ["alerts", "messages"], group: "system" },
  { label: "Settings", href: "/settings", icon: Settings, keywords: ["preferences", "account", "profile"], group: "system" },
  { label: "Help & Support", href: "/support", icon: HelpCircle, keywords: ["faq", "contact", "docs"], group: "system" },
];
