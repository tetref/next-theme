"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@dashboardpack/core/components/ui/card";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dashboardpack/core/components/ui/dialog";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { EmptyState } from "@dashboardpack/core/components/shared/empty-state";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Trash2,
  Star,
  Search,
  ArrowLeft,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Plus,
  CheckCheck,
  Circle,
} from "lucide-react";
import {
  getEmails,
  getEmail,
  getFolderCounts,
  markAsRead,
  toggleStar,
  moveToTrash,
  bulkMoveToTrash,
  bulkMarkRead,
  sendEmail,
  saveDraft,
} from "@dashboardpack/core/lib/data/mail";
import type { Email, EmailFolder, EmailLabel } from "@dashboardpack/core/lib/data/mail";

// ── Helpers ──

function formatEmailDate(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const labelColors: Record<EmailLabel, { dot: string; text: string }> = {
  personal: { dot: "bg-chart-1", text: "text-chart-1" },
  work: { dot: "bg-chart-2", text: "text-chart-2" },
  important: { dot: "bg-destructive", text: "text-destructive" },
  updates: { dot: "bg-chart-4", text: "text-chart-4" },
};

const folderConfig: { id: EmailFolder; label: string; icon: React.ElementType }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "starred", label: "Starred", icon: Star },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const allLabels: EmailLabel[] = ["personal", "work", "important", "updates"];

// ── Sub-components ──

function MailSidebar({
  activeFolder,
  onFolderChange,
  counts,
  collapsed,
}: {
  activeFolder: EmailFolder;
  onFolderChange: (folder: EmailFolder) => void;
  counts: Record<EmailFolder, number>;
  collapsed: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <ComposeDialog />
      </div>
      <Separator />
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {folderConfig.map(({ id, label, icon: Icon }) => {
          const count = id === "inbox" ? counts.inbox : id === "drafts" ? counts.drafts : 0;
          return (
            <button
              key={id}
              onClick={() => onFolderChange(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeFolder === id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-start">{label}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                      {count}
                    </Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
        {!collapsed && (
          <>
            <Separator className="my-2" />
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Labels
            </p>
            {allLabels.map((label) => (
              <div key={label} className="flex items-center gap-3 px-3 py-1.5 text-sm text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", labelColors[label].dot)} />
                <span className="capitalize">{label}</span>
              </div>
            ))}
          </>
        )}
      </nav>
    </div>
  );
}

function ComposeDialog() {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const reset = () => { setTo(""); setSubject(""); setBody(""); };

  const handleSend = () => {
    if (!to.trim() || !subject.trim()) {
      toast.error("Please fill in the To and Subject fields.");
      return;
    }
    sendEmail(to, subject, body);
    toast.success("Email sent!");
    reset();
    setOpen(false);
  };

  const handleSaveDraft = () => {
    saveDraft(to, subject, body);
    toast.success("Draft saved.");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Textarea
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSend}>
            <Send className="me-2 h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MailToolbar({
  search,
  onSearchChange,
  selectedCount,
  onBulkTrash,
  onBulkMarkRead,
  onSelectAll,
  allSelected,
  emailCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkTrash: () => void;
  onBulkMarkRead: () => void;
  onSelectAll: () => void;
  allSelected: boolean;
  emailCount: number;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
      <Checkbox
        checked={emailCount > 0 && allSelected}
        onCheckedChange={onSelectAll}
        aria-label="Select all"
      />
      {selectedCount > 0 ? (
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-medium text-muted-foreground">
            {selectedCount} selected
          </span>
          <Button variant="ghost" size="icon-xs" onClick={onBulkMarkRead} aria-label="Mark as read">
            <CheckCheck className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onBulkTrash} aria-label="Move to trash">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="relative flex-1">
          <Search className="absolute ltr:left-2.5 rtl:right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 ps-8 text-xs"
          />
        </div>
      )}
    </div>
  );
}

function EmailRow({
  email,
  selected,
  onSelect,
  onOpen,
  onToggleStar,
}: {
  email: Email;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onToggleStar: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-2.5 transition-colors cursor-pointer",
        !email.read ? "bg-primary/[0.03] font-medium" : "hover:bg-accent/50",
        selected && "bg-accent"
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${email.subject}`}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
        className="shrink-0"
        aria-label={email.starred ? "Unstar" : "Star"}
      >
        <Star
          className={cn(
            "h-4 w-4 transition-colors",
            email.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-400"
          )}
        />
      </button>
      <div className="flex-1 min-w-0" onClick={onOpen}>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm truncate", !email.read && "font-semibold")}>
            {email.from.name}
          </span>
          {email.hasAttachment && <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />}
          {email.labels.map((label) => (
            <Circle
              key={label}
              className={cn("h-2 w-2 shrink-0 fill-current", labelColors[label].text)}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn("text-xs truncate", !email.read ? "text-foreground" : "text-muted-foreground")}>
            {email.subject}
          </span>
          <span className="text-xs text-muted-foreground/60 truncate hidden sm:inline">
            — {email.preview}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-[10px] text-muted-foreground" onClick={onOpen}>
        {formatEmailDate(email.date)}
      </span>
    </div>
  );
}

function EmailView({
  email,
  onBack,
  onToggleStar,
  onTrash,
}: {
  email: Email;
  onBack: () => void;
  onToggleStar: () => void;
  onTrash: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="flex-1 text-sm font-semibold truncate">{email.subject}</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleStar}
          aria-label={email.starred ? "Unstar" : "Star"}
        >
          <Star
            className={cn(
              "h-4 w-4",
              email.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => { onTrash(); onBack(); }}
          aria-label="Move to trash"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Sender */}
        <div className="flex items-start gap-3 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-xs">{email.from.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-semibold">{email.from.name}</span>
              <span className="text-xs text-muted-foreground">&lt;{email.from.email}&gt;</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              to {email.to} · {formatFullDate(email.date)}
            </p>
          </div>
          {email.labels.length > 0 && (
            <div className="flex gap-1 shrink-0">
              {email.labels.map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className={cn("text-[10px] capitalize", labelColors[label].text)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground whitespace-pre-line">
          {email.body}
        </div>

        {email.hasAttachment && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-border p-3">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">1 attachment</span>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-border px-4 py-3 flex gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { toast("Reply coming soon!"); }}>
          <Reply className="h-3.5 w-3.5" />
          Reply
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { toast("Forward coming soon!"); }}>
          <Forward className="h-3.5 w-3.5" />
          Forward
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function MailPage() {
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox");
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const folderCounts = getFolderCounts();
  const emailList = getEmails(activeFolder, search);
  const activeEmail = activeEmailId ? getEmail(activeEmailId) : undefined;

  const handleFolderChange = useCallback((folder: EmailFolder) => {
    setActiveFolder(folder);
    setActiveEmailId(null);
    setSelectedIds(new Set());
    setSearch("");
  }, []);

  const handleOpenEmail = useCallback(
    (id: string) => {
      markAsRead(id);
      setActiveEmailId(id);
      setSelectedIds(new Set());
      refresh();
    },
    [refresh]
  );

  const handleBack = useCallback(() => {
    setActiveEmailId(null);
  }, []);

  const handleToggleStar = useCallback(
    (id: string) => {
      toggleStar(id);
      refresh();
    },
    [refresh]
  );

  const handleTrash = useCallback(
    (id: string) => {
      moveToTrash(id);
      toast.success("Moved to trash.");
      refresh();
    },
    [refresh]
  );

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === emailList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(emailList.map((e) => e.id)));
    }
  }, [selectedIds.size, emailList]);

  const handleBulkTrash = useCallback(() => {
    bulkMoveToTrash(Array.from(selectedIds));
    toast.success(`${selectedIds.size} email${selectedIds.size > 1 ? "s" : ""} moved to trash.`);
    setSelectedIds(new Set());
    refresh();
  }, [selectedIds, refresh]);

  const handleBulkMarkRead = useCallback(() => {
    bulkMarkRead(Array.from(selectedIds));
    toast.success("Marked as read.");
    setSelectedIds(new Set());
    refresh();
  }, [selectedIds, refresh]);

  // Determine what to show in the main area
  const showEmailView = !!activeEmail;

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Mail"
          description="Email inbox and messages."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Mail" },
          ]}
        />
      </div>

      <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
        {/* Sidebar — folders & labels */}
        <div
          className={cn(
            "w-full flex-col border-e border-border md:w-56 md:shrink-0",
            (activeEmailId || emailList.length > 0) ? "hidden md:flex" : "flex"
          )}
        >
          <MailSidebar
            activeFolder={activeFolder}
            onFolderChange={handleFolderChange}
            counts={folderCounts}
            collapsed={false}
          />
        </div>

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          {showEmailView && activeEmail ? (
            <EmailView
              email={activeEmail}
              onBack={handleBack}
              onToggleStar={() => handleToggleStar(activeEmail.id)}
              onTrash={() => handleTrash(activeEmail.id)}
            />
          ) : (
            <>
              <MailToolbar
                search={search}
                onSearchChange={setSearch}
                selectedCount={selectedIds.size}
                onBulkTrash={handleBulkTrash}
                onBulkMarkRead={handleBulkMarkRead}
                onSelectAll={handleSelectAll}
                allSelected={emailList.length > 0 && selectedIds.size === emailList.length}
                emailCount={emailList.length}
              />
              <div className="flex-1 overflow-y-auto">
                {emailList.length === 0 ? (
                  <EmptyState
                    icon={<Mail />}
                    title="No emails"
                    description={search ? "No emails match your search." : "This folder is empty."}
                    className="h-full"
                  />
                ) : (
                  emailList.map((email) => (
                    <EmailRow
                      key={email.id}
                      email={email}
                      selected={selectedIds.has(email.id)}
                      onSelect={() => handleToggleSelect(email.id)}
                      onOpen={() => handleOpenEmail(email.id)}
                      onToggleStar={() => handleToggleStar(email.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
