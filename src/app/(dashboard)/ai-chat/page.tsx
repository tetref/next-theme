"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@dashboardpack/core/components/ui/card";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  Bot,
  Search,
  ArrowLeft,
  Paperclip,
  Send,
  Plus,
  Sparkles,
  Copy,
  Check,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

// ── Types ──

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  hasCode?: boolean;
}

interface AIConversation {
  id: string;
  title: string;
  preview: string;
  lastMessageTime: string;
  model: string;
  messages: AIMessage[];
}

// ── Helpers ──

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatConversationTime(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return formatMessageTime(iso);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDateLabel(iso: string): string {
  const now = new Date();
  const date = new Date(iso);

  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (nowDay.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupMessagesByDate(msgs: AIMessage[]): [string, AIMessage[]][] {
  const groups: Map<string, AIMessage[]> = new Map();
  for (const m of msgs) {
    const label = getDateLabel(m.timestamp);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(m);
  }
  return Array.from(groups.entries());
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ── Mock Data ──

const AI_MODELS = [
  { id: "gpt-4o", label: "GPT-4o", badge: "OpenAI" },
  { id: "claude-3.5", label: "Claude 3.5", badge: "Anthropic" },
  { id: "gemini-pro", label: "Gemini Pro", badge: "Google" },
  { id: "llama-3", label: "Llama 3", badge: "Meta" },
] as const;

const now = new Date();
function hoursAgo(h: number): string {
  return new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
}
function daysAgo(d: number, h = 0): string {
  return new Date(
    now.getTime() - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000
  ).toISOString();
}

const INITIAL_CONVERSATIONS: AIConversation[] = [
  {
    id: "conv-1",
    title: "Python script help",
    preview: "How do I read a CSV file and filter rows...",
    lastMessageTime: hoursAgo(0.5),
    model: "gpt-4o",
    messages: [
      {
        id: "m1-1",
        role: "user",
        text: "How do I read a CSV file in Python and filter rows where the 'status' column equals 'active'?",
        timestamp: hoursAgo(1),
      },
      {
        id: "m1-2",
        role: "assistant",
        text: "You can use the `pandas` library to read and filter CSV data easily. Here's a complete example:\n\n```python\nimport pandas as pd\n\n# Read the CSV file\ndf = pd.read_csv('data.csv')\n\n# Filter rows where status is 'active'\nactive_rows = df[df['status'] == 'active']\n\n# Display results\nprint(f\"Found {len(active_rows)} active records\")\nprint(active_rows.head())\n```\n\nAlternatively, if you want to avoid the pandas dependency, you can use the built-in `csv` module:\n\n```python\nimport csv\n\nwith open('data.csv', 'r') as f:\n    reader = csv.DictReader(f)\n    active_rows = [row for row in reader if row['status'] == 'active']\n```\n\nThe pandas approach is recommended for larger datasets as it's more memory-efficient and provides additional filtering capabilities.",
        timestamp: hoursAgo(0.9),
        hasCode: true,
      },
      {
        id: "m1-3",
        role: "user",
        text: "Can I also sort the results by the 'created_at' column?",
        timestamp: hoursAgo(0.6),
      },
      {
        id: "m1-4",
        role: "assistant",
        text: "Absolutely! Just chain the `sort_values()` method:\n\n```python\nactive_sorted = df[df['status'] == 'active'].sort_values(\n    by='created_at',\n    ascending=False  # newest first\n)\n```\n\nIf `created_at` contains date strings, you might want to convert them to proper datetime objects first for accurate sorting:\n\n```python\ndf['created_at'] = pd.to_datetime(df['created_at'])\nactive_sorted = df[df['status'] == 'active'].sort_values('created_at', ascending=False)\n```\n\nThis ensures dates like \"2024-01-15\" and \"2024-02-01\" sort correctly rather than being sorted alphabetically.",
        timestamp: hoursAgo(0.5),
        hasCode: true,
      },
    ],
  },
  {
    id: "conv-2",
    title: "Database schema design",
    preview: "I need help designing a schema for a multi-tenant...",
    lastMessageTime: hoursAgo(3),
    model: "claude-3.5",
    messages: [
      {
        id: "m2-1",
        role: "user",
        text: "I need help designing a database schema for a multi-tenant SaaS application. Each tenant should have their own data isolated but share the same database.",
        timestamp: hoursAgo(4),
      },
      {
        id: "m2-2",
        role: "assistant",
        text: "Great question! For multi-tenant SaaS with shared database isolation, I recommend using a **tenant_id column** approach (also called row-level security). Here's a schema design:\n\n```sql\n-- Core tenant table\nCREATE TABLE tenants (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    name VARCHAR(255) NOT NULL,\n    slug VARCHAR(100) UNIQUE NOT NULL,\n    plan VARCHAR(50) DEFAULT 'free',\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Users belong to a tenant\nCREATE TABLE users (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    tenant_id UUID NOT NULL REFERENCES tenants(id),\n    email VARCHAR(255) NOT NULL,\n    role VARCHAR(50) DEFAULT 'member',\n    UNIQUE(tenant_id, email)\n);\n\n-- Example domain table with tenant isolation\nCREATE TABLE projects (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    tenant_id UUID NOT NULL REFERENCES tenants(id),\n    name VARCHAR(255) NOT NULL,\n    created_by UUID REFERENCES users(id)\n);\n\n-- Add indexes for performance\nCREATE INDEX idx_users_tenant ON users(tenant_id);\nCREATE INDEX idx_projects_tenant ON projects(tenant_id);\n```\n\n**Key principles:**\n\n1. Every table includes a `tenant_id` foreign key\n2. All queries must filter by `tenant_id` (enforce in your ORM/middleware)\n3. Use PostgreSQL Row Level Security (RLS) as an additional safeguard\n4. Composite unique constraints prevent cross-tenant collisions\n\nWant me to show the RLS policy setup as well?",
        timestamp: hoursAgo(3.5),
        hasCode: true,
      },
      {
        id: "m2-3",
        role: "user",
        text: "Yes, show me the RLS policies please.",
        timestamp: hoursAgo(3),
      },
      {
        id: "m2-4",
        role: "assistant",
        text: "Here are the Row Level Security policies for PostgreSQL:\n\n```sql\n-- Enable RLS on tables\nALTER TABLE users ENABLE ROW LEVEL SECURITY;\nALTER TABLE projects ENABLE ROW LEVEL SECURITY;\n\n-- Create policy: users can only see their tenant's data\nCREATE POLICY tenant_isolation ON users\n    USING (tenant_id = current_setting('app.tenant_id')::UUID);\n\nCREATE POLICY tenant_isolation ON projects\n    USING (tenant_id = current_setting('app.tenant_id')::UUID);\n```\n\nIn your application middleware, set the tenant context at the start of each request:\n\n```sql\nSET app.tenant_id = 'tenant-uuid-here';\n```\n\nThis provides a defense-in-depth approach -- even if your application code has a bug that forgets to filter by tenant_id, the database itself will enforce the isolation.",
        timestamp: hoursAgo(3),
        hasCode: true,
      },
    ],
  },
  {
    id: "conv-3",
    title: "Marketing copy review",
    preview: "Can you review this landing page copy for our...",
    lastMessageTime: hoursAgo(8),
    model: "gpt-4o",
    messages: [
      {
        id: "m3-1",
        role: "user",
        text: "Can you review this landing page copy for our project management tool?\n\n\"TaskFlow - The Ultimate Project Management Solution\nManage your projects better with TaskFlow. Our tool helps teams collaborate and get things done faster. Sign up today and see the difference.\"",
        timestamp: hoursAgo(9),
      },
      {
        id: "m3-2",
        role: "assistant",
        text: "I can see the core message, but the copy could be much more compelling. Here are my suggestions:\n\n**Issues with the current copy:**\n- \"Ultimate\" is an overused superlative that dilutes trust\n- \"Manage your projects better\" is vague -- better than what?\n- No specific value proposition or differentiator\n- \"Get things done faster\" lacks specificity\n- No social proof or urgency\n\n**Suggested rewrite:**\n\n\"TaskFlow -- Ship Projects 2x Faster\n\nThe project management tool that replaces scattered Slack threads, lost emails, and endless status meetings with one clear workspace.\n\nJoin 3,200+ teams who've cut their project delivery time in half.\n\n[Start Free -- No Credit Card Required]\"\n\n**Why this works better:**\n1. Specific claim (\"2x Faster\") creates curiosity\n2. Pain points (Slack threads, lost emails) resonate with the target audience\n3. Social proof (3,200+ teams) builds credibility\n4. Low-friction CTA removes signup hesitation\n5. Outcome-focused rather than feature-focused\n\nWant me to also draft the supporting sections below the fold?",
        timestamp: hoursAgo(8),
      },
    ],
  },
  {
    id: "conv-4",
    title: "React hooks explained",
    preview: "What's the difference between useMemo and...",
    lastMessageTime: daysAgo(1, 2),
    model: "claude-3.5",
    messages: [
      {
        id: "m4-1",
        role: "user",
        text: "What's the difference between useMemo and useCallback in React? I keep mixing them up.",
        timestamp: daysAgo(1, 3),
      },
      {
        id: "m4-2",
        role: "assistant",
        text: "They're closely related but serve different purposes. Here's the simple mental model:\n\n- **`useMemo`** memoizes a **computed value**\n- **`useCallback`** memoizes a **function reference**\n\n```tsx\n// useMemo: caches the RESULT of the computation\nconst sortedItems = useMemo(() => {\n  return items.sort((a, b) => a.name.localeCompare(b.name));\n}, [items]);\n\n// useCallback: caches the FUNCTION itself\nconst handleClick = useCallback((id: string) => {\n  setSelected(id);\n}, []);\n```\n\n**When to use `useMemo`:**\n- Expensive computations (sorting, filtering large arrays)\n- Derived data that shouldn't recompute every render\n- Object/array references passed to child components\n\n**When to use `useCallback`:**\n- Functions passed as props to memoized children (`React.memo`)\n- Functions used as dependencies in other hooks\n- Event handlers in performance-critical lists\n\n**Fun fact:** `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. The `useCallback` hook is just syntactic sugar!\n\n**When to skip both:** Don't prematurely optimize. If your component renders fast without them, adding memoization just adds complexity. Profile first, optimize second.",
        timestamp: daysAgo(1, 2),
        hasCode: true,
      },
    ],
  },
  {
    id: "conv-5",
    title: "Budget analysis",
    preview: "Help me analyze this quarterly budget data...",
    lastMessageTime: daysAgo(2, 5),
    model: "gemini-pro",
    messages: [
      {
        id: "m5-1",
        role: "user",
        text: "Help me analyze this quarterly budget data. Q1: Revenue $245K, Expenses $198K. Q2: Revenue $312K, Expenses $267K. Q3: Revenue $289K, Expenses $241K. Q4: Revenue $378K, Expenses $295K.",
        timestamp: daysAgo(2, 6),
      },
      {
        id: "m5-2",
        role: "assistant",
        text: "Here's a comprehensive analysis of your quarterly budget data:\n\n**Profit Margins by Quarter:**\n\n| Quarter | Revenue | Expenses | Profit | Margin |\n|---------|---------|----------|--------|--------|\n| Q1 | $245K | $198K | $47K | 19.2% |\n| Q2 | $312K | $267K | $45K | 14.4% |\n| Q3 | $289K | $241K | $48K | 16.6% |\n| Q4 | $378K | $295K | $83K | 22.0% |\n\n**Key Insights:**\n\n1. **Annual totals:** $1.224M revenue, $1.001M expenses, $223K profit (18.2% margin)\n\n2. **Revenue trend is strong** -- 54% growth from Q1 to Q4, suggesting successful scaling\n\n3. **Q2 is the concern:** Despite highest revenue growth quarter-over-quarter (+27%), margins dipped to 14.4%. Expenses grew faster than revenue (34.8% vs 27.3%). Investigate what drove the cost spike.\n\n4. **Q4 is the star:** Best margin at 22% with highest absolute profit. The expense-to-revenue ratio improved significantly.\n\n5. **Expense ratio is improving:** Q1 (80.8%) -> Q4 (78.0%), showing better operational efficiency over time.\n\n**Recommendation:** Deep-dive into Q2 expenses to understand the anomaly. If it was one-time investment (hiring, equipment), the trend is healthy. If recurring, you need to address cost control before scaling further.",
        timestamp: daysAgo(2, 5),
      },
    ],
  },
  {
    id: "conv-6",
    title: "Travel itinerary",
    preview: "Plan a 5-day trip to Tokyo for a first-time...",
    lastMessageTime: daysAgo(3, 1),
    model: "gpt-4o",
    messages: [
      {
        id: "m6-1",
        role: "user",
        text: "Plan a 5-day trip to Tokyo for a first-time visitor in April. I'm interested in culture, food, and some nature.",
        timestamp: daysAgo(3, 2),
      },
      {
        id: "m6-2",
        role: "assistant",
        text: "Here's your 5-day Tokyo itinerary for April -- perfect timing for cherry blossom season!\n\n**Day 1: Classic Tokyo**\n- Morning: Senso-ji Temple in Asakusa (arrive by 8am to avoid crowds)\n- Walk through Nakamise-dori for street snacks\n- Afternoon: Ueno Park for cherry blossoms + Tokyo National Museum\n- Evening: Dinner in Ameyoko market area (try yakitori at Toriyoshi)\n\n**Day 2: Modern Tokyo + Food**\n- Morning: Tsukiji Outer Market for breakfast (tamagoyaki, fresh sushi)\n- TeamLab Borderless digital art museum\n- Afternoon: Shibuya crossing + Harajuku\n- Evening: Ramen dinner at Fuunji (Shinjuku) + Golden Gai bar-hopping\n\n**Day 3: Nature Day Trip**\n- Full day: Mt. Takao (45 min from Shinjuku)\n- Hike Trail #1 (90 min up) -- stunning views if clear\n- Try tororo soba at the summit\n- Return via Takaosanguchi onsen for a foot bath\n\n**Day 4: Culture Deep Dive**\n- Morning: Meiji Shrine (peaceful forest walk)\n- Afternoon: Shinjuku Gyoen garden (peak cherry blossoms in April)\n- Late afternoon: Akihabara for electronics/anime culture\n- Evening: Cooking class in Asakusa (learn to make gyoza)\n\n**Day 5: Hidden Gems**\n- Morning: Yanaka neighborhood (old Tokyo charm, cat street)\n- Shimokitazawa for vintage shopping + coffee\n- Afternoon: Odaiba waterfront + teamLab Planets\n- Final dinner: Omakase sushi experience (book Sushi Saito or similar)\n\n**Budget tip:** Get a 72-hour Tokyo Metro pass ($15) -- covers most travel within the city.\n\nWant me to add hotel recommendations or specific restaurant bookings?",
        timestamp: daysAgo(3, 1),
      },
    ],
  },
  {
    id: "conv-7",
    title: "Regex pattern matching",
    preview: "I need a regex to validate email addresses that...",
    lastMessageTime: daysAgo(5),
    model: "claude-3.5",
    messages: [
      {
        id: "m7-1",
        role: "user",
        text: "I need a regex to validate email addresses that also catches common typos like missing TLDs. Can you help?",
        timestamp: daysAgo(5, 1),
      },
      {
        id: "m7-2",
        role: "assistant",
        text: "Here's a practical email validation regex that balances strictness with usability:\n\n```javascript\nconst emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z]{2,})+$/;\n```\n\nHowever, I'd actually recommend a **two-step approach** instead of trying to catch everything with regex:\n\n```javascript\nfunction validateEmail(email) {\n  // Step 1: Basic format check\n  const basicRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  if (!basicRegex.test(email)) return { valid: false, error: 'Invalid email format' };\n\n  // Step 2: Common typo detection\n  const domain = email.split('@')[1].toLowerCase();\n  const typoMap = {\n    'gmial.com': 'gmail.com',\n    'gmai.com': 'gmail.com',\n    'gamil.com': 'gmail.com',\n    'gnail.com': 'gmail.com',\n    'hotmal.com': 'hotmail.com',\n    'outloo.com': 'outlook.com',\n    'yaho.com': 'yahoo.com',\n  };\n\n  if (typoMap[domain]) {\n    return {\n      valid: true,\n      suggestion: `Did you mean ${email.split('@')[0]}@${typoMap[domain]}?`\n    };\n  }\n\n  return { valid: true };\n}\n```\n\nThis approach gives you validation plus helpful \"did you mean?\" suggestions, which is much better UX than silently rejecting or accepting typos.",
        timestamp: daysAgo(5),
        hasCode: true,
      },
    ],
  },
];

const AI_RESPONSES: string[] = [
  "That's a great question! Let me break this down step by step.\n\nFirst, it's important to understand the underlying concepts. The approach you're describing is commonly used in production systems and there are several well-established patterns for implementing it.\n\nHere are the key considerations:\n\n1. **Performance** -- Make sure to benchmark your implementation with realistic data volumes\n2. **Maintainability** -- Keep the code modular so individual pieces can be tested in isolation\n3. **Error handling** -- Always account for edge cases and provide meaningful error messages\n\nWould you like me to elaborate on any of these points?",
  "I'd be happy to help with that! Here's what I'd recommend:\n\n```python\ndef process_data(items):\n    results = []\n    for item in items:\n        if item.is_valid():\n            results.append(transform(item))\n    return results\n```\n\nThis pattern gives you clean separation between validation and transformation. The key insight is that by filtering first, you avoid unnecessary processing of invalid items.\n\nLet me know if you want me to add error handling or logging to this example.",
  "Based on my analysis, here are the main takeaways:\n\n**Strengths:**\n- Clear structure and organization\n- Good use of modern best practices\n- Consistent naming conventions throughout\n\n**Areas for improvement:**\n- Consider adding input validation at the boundary layer\n- The current approach may not scale well beyond 10K records -- consider pagination\n- Adding retry logic for external API calls would improve reliability\n\nOverall, this is a solid foundation. The improvements I've suggested are optimizations rather than fundamental issues. Want me to prioritize these recommendations?",
  "Here's a concise solution using a functional approach:\n\n```typescript\nconst filterAndSort = <T extends Record<string, unknown>>(\n  data: T[],\n  predicate: (item: T) => boolean,\n  sortKey: keyof T\n): T[] => {\n  return data\n    .filter(predicate)\n    .sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])));\n};\n```\n\nThis utility function is generic, type-safe, and composable. You can use it like:\n\n```typescript\nconst activeUsers = filterAndSort(\n  users,\n  (u) => u.status === 'active',\n  'name'\n);\n```\n\nThe generic constraint `Record<string, unknown>` ensures you can only pass objects, while `keyof T` makes the sort key type-safe.",
  "Absolutely! Let me walk you through the complete workflow:\n\n**Step 1:** Set up your development environment\n- Make sure you have the latest LTS version of Node.js installed\n- Initialize a new project with `npm init -y`\n\n**Step 2:** Install the required dependencies\n- Core framework and utilities\n- Testing libraries (I recommend Vitest for its speed)\n- Linting and formatting tools\n\n**Step 3:** Configure your project structure\n- Keep source code in `src/`\n- Tests alongside the files they test (co-location pattern)\n- Shared utilities in `src/lib/`\n\n**Step 4:** Implement the core logic first, then add the UI layer\n\nThis approach follows the \"inside-out\" development pattern, which helps you build a solid foundation before worrying about presentation. Each step is independently testable.\n\nShall I generate the boilerplate code for any of these steps?",
  "That's an interesting problem! The most efficient approach here uses a sliding window technique:\n\n```javascript\nfunction maxSubarraySum(arr, windowSize) {\n  if (arr.length < windowSize) return null;\n\n  let maxSum = 0;\n  let windowSum = 0;\n\n  // Calculate initial window\n  for (let i = 0; i < windowSize; i++) {\n    windowSum += arr[i];\n  }\n  maxSum = windowSum;\n\n  // Slide the window\n  for (let i = windowSize; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - windowSize];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n\n  return maxSum;\n}\n```\n\nTime complexity: O(n) -- we only pass through the array once.\nSpace complexity: O(1) -- just two variables regardless of input size.\n\nThis is a significant improvement over the brute-force O(n * k) approach. The trick is that instead of recalculating the sum for each window position, we just add the new element and subtract the one that fell off.",
];

// ── Sub-components ──

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group/code relative my-2 rounded-lg bg-zinc-950 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-[11px] text-zinc-400">code</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-[13px] leading-relaxed text-zinc-100">{code}</code>
      </pre>
    </div>
  );
}

function renderMessageContent(text: string) {
  // Split on code blocks (```...```)
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      // Extract code content, removing the opening/closing ``` and optional language identifier
      const lines = part.slice(3, -3).split("\n");
      // If first line is a language identifier (no spaces), skip it
      const firstLine = lines[0]?.trim();
      const hasLangId = firstLine && !firstLine.includes(" ") && firstLine.length < 20;
      const code = hasLangId ? lines.slice(1).join("\n") : lines.join("\n");
      return <CodeBlock key={i} code={code.trim()} />;
    }

    // Render non-code text with basic formatting
    return (
      <span key={i}>
        {part.split("\n").map((line, j, arr) => {
          // Bold text
          const formatted = line.split(/(\*\*[^*]+\*\*)/g).map((segment, k) => {
            if (segment.startsWith("**") && segment.endsWith("**")) {
              return (
                <strong key={k} className="font-semibold">
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            // Inline code
            return segment.split(/(`[^`]+`)/g).map((sub, l) => {
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return (
                  <code
                    key={l}
                    className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono"
                  >
                    {sub.slice(1, -1)}
                  </code>
                );
              }
              return sub;
            });
          });

          return (
            <React.Fragment key={j}>
              {formatted}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </span>
    );
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-1">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-2xl rounded-es-md bg-muted px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function AIMessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[80%]", isUser ? "items-end" : "items-start")}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1 px-1">
            <span className="text-[11px] font-medium text-muted-foreground">AI Assistant</span>
            <Sparkles className="h-3 w-3 text-primary/60" />
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isUser
              ? "rounded-ee-md bg-primary text-primary-foreground"
              : "rounded-es-md bg-muted"
          )}
        >
          <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {isUser ? message.text : renderMessageContent(message.text)}
          </div>
        </div>
        <div
          className={cn(
            "mt-1 flex items-center gap-1 px-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-[10px] text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function MessageThread({
  messages,
  isTyping,
}: {
  messages: AIMessage[];
  isTyping: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const dateGroups = groupMessagesByDate(messages);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isTyping]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div className="space-y-6">
        {dateGroups.map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-3 mb-4">
              <Separator className="flex-1" />
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {dateLabel}
              </span>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-4">
              {msgs.map((msg) => (
                <AIMessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {isTyping && (
        <div className="mt-4">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function ConversationItem({
  conversation,
  active,
  onSelect,
}: {
  conversation: AIConversation;
  active: boolean;
  onSelect: () => void;
}) {
  const model = AI_MODELS.find((m) => m.id === conversation.model);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors",
        active ? "bg-accent" : "hover:bg-accent/50"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{conversation.title}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {formatConversationTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground truncate">{conversation.preview}</p>
          {model && (
            <Badge variant="secondary" className="shrink-0 text-[9px] px-1.5 py-0 h-4">
              {model.label}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

function ConversationList({
  conversations,
  activeId,
  onSelect,
  search,
  onSearchChange,
  selectedModel,
  onModelChange,
  onNewChat,
}: {
  conversations: AIConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onNewChat: () => void;
}) {
  const filtered = conversations.filter((conv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      conv.title.toLowerCase().includes(q) ||
      conv.preview.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header with New Chat + Model selector */}
      <div className="shrink-0 p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <Button onClick={onNewChat} size="sm" className="flex-1 gap-1.5">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-xs">
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  <span className="text-muted-foreground">{model.badge}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute ltr:left-2.5 rtl:right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-9 h-8 text-xs"
          />
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No conversations found
          </p>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              active={conv.id === activeId}
              onSelect={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ChatHeaderBar({
  conversation,
  onBack,
}: {
  conversation: AIConversation;
  onBack: () => void;
}) {
  const model = AI_MODELS.find((m) => m.id === conversation.model);

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onBack}
        aria-label="Back to conversations"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="relative">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 ltr:right-0 rtl:left-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{conversation.title}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {model?.label ?? "AI"}
          </span>
          {model && (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
              {model.badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="More options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Delete conversation">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageInput({
  onSend,
  modelLabel,
}: {
  onSend: (text: string) => void;
  modelLabel: string;
}) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="shrink-0 border-t border-border px-4 py-3">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 mb-0.5"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1 relative">
          <Textarea
            placeholder="Send a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] max-h-[120px] resize-none pe-16"
            rows={1}
          />
          <Badge
            variant="secondary"
            className="absolute bottom-2 ltr:right-2 rtl:left-2 text-[9px] px-1.5 py-0 h-4 pointer-events-none"
          >
            {modelLabel}
          </Badge>
        </div>
        <Button
          size="icon-sm"
          className="shrink-0 mb-0.5"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
        AI responses are generated for demo purposes only. Press Enter to send, Shift+Enter for new line.
      </p>
    </div>
  );
}

function NewChatWelcome() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center max-w-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">How can I help you today?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ask me anything -- from writing code and analyzing data to brainstorming ideas and drafting content. Start a conversation below.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {[
            "Write a Python function",
            "Explain a concept",
            "Debug my code",
            "Draft an email",
          ].map((suggestion) => (
            <button
              key={suggestion}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function AIChatPage() {
  const [conversations, setConversations] = useState<AIConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeConversation = activeConversationId
    ? conversations.find((c) => c.id === activeConversationId)
    : undefined;

  const currentModelLabel =
    AI_MODELS.find((m) => m.id === selectedModel)?.label ?? "AI";

  const selectConversation = useCallback((id: string) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsTyping(false);
    setActiveConversationId(id);
  }, []);

  const handleBack = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsTyping(false);
    setActiveConversationId(null);
  }, []);

  const handleNewChat = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsTyping(false);

    const newConv: AIConversation = {
      id: `conv-new-${generateId()}`,
      title: "New conversation",
      preview: "Start a new conversation...",
      lastMessageTime: new Date().toISOString(),
      model: selectedModel,
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  }, [selectedModel]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!activeConversationId) return;

      const userMsg: AIMessage = {
        id: `msg-${generateId()}`,
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;
          const isFirstMessage = conv.messages.length === 0;
          return {
            ...conv,
            title: isFirstMessage ? text.slice(0, 40) + (text.length > 40 ? "..." : "") : conv.title,
            preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
            lastMessageTime: userMsg.timestamp,
            model: selectedModel,
            messages: [...conv.messages, userMsg],
          };
        })
      );

      // Simulate AI typing then response
      const t1 = setTimeout(() => {
        setIsTyping(true);
      }, 400);

      const t2 = setTimeout(() => {
        setIsTyping(false);

        const responseText =
          AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

        const aiMsg: AIMessage = {
          id: `msg-${generateId()}`,
          role: "assistant",
          text: responseText,
          timestamp: new Date().toISOString(),
          hasCode: responseText.includes("```"),
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== activeConversationId) return conv;
            return {
              ...conv,
              preview: responseText.slice(0, 50) + "...",
              lastMessageTime: aiMsg.timestamp,
              messages: [...conv.messages, aiMsg],
            };
          })
        );
      }, 1500 + Math.random() * 1000);

      timeoutsRef.current.push(t1, t2);
    },
    [activeConversationId, selectedModel]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    const ref = timeoutsRef;
    return () => {
      ref.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="AI Chat"
          description="Conversational AI assistant."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI Chat" },
          ]}
        />
      </div>

      <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
        {/* Conversation list */}
        <div
          className={cn(
            "w-full flex-col border-e border-border md:w-80 md:shrink-0",
            activeConversationId ? "hidden md:flex" : "flex"
          )}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={selectConversation}
            search={search}
            onSearchChange={setSearch}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Message area */}
        <div
          className={cn(
            "flex-1 flex-col",
            activeConversationId ? "flex" : "hidden md:flex"
          )}
        >
          {activeConversation ? (
            <>
              <ChatHeaderBar
                conversation={activeConversation}
                onBack={handleBack}
              />
              {activeConversation.messages.length > 0 ? (
                <MessageThread
                  messages={activeConversation.messages}
                  isTyping={isTyping}
                />
              ) : (
                <NewChatWelcome />
              )}
              <MessageInput
                onSend={handleSendMessage}
                modelLabel={currentModelLabel}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<Bot />}
                title="Select a conversation"
                description="Choose a conversation from the list or start a new chat."
              />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
