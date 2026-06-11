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
  MessageCircle,
  Search,
  ArrowLeft,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Send,
  Check,
  CheckCheck,
  Users,
} from "lucide-react";
import {
  getContacts,
  getContact,
  getConversations,
  getConversation,
  getMessages,
  addMessage,
  addReplyMessage,
  markConversationRead,
  getAutoReply,
} from "@dashboardpack/core/lib/data/chat";
import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  ContactStatus,
} from "@dashboardpack/core/lib/data/chat";

// ── Helpers ──

const statusColor: Record<ContactStatus, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/40",
};

const statusLabel: Record<ContactStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

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
  const diffDays = Math.round((nowDay.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function groupMessagesByDate(msgs: ChatMessage[]): [string, ChatMessage[]][] {
  const groups: Map<string, ChatMessage[]> = new Map();
  for (const m of msgs) {
    const label = getDateLabel(m.timestamp);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(m);
  }
  return Array.from(groups.entries());
}

// ── Sub-components ──

function StatusDot({ status, className }: { status: ContactStatus; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 ltr:right-0 rtl:left-0 h-2.5 w-2.5 rounded-full border-2 border-background",
        statusColor[status],
        className
      )}
    />
  );
}

function ConversationItem({
  conversation,
  contact,
  active,
  onSelect,
}: {
  conversation: ChatConversation;
  contact?: ChatContact;
  active: boolean;
  onSelect: () => void;
}) {
  const isGroup = conversation.type === "group";

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
          <AvatarFallback className={cn("text-xs", isGroup && "bg-primary/15 text-primary")}>
            {isGroup ? <Users className="h-4 w-4" /> : contact?.initials ?? "?"}
          </AvatarFallback>
        </Avatar>
        {contact && !isGroup && <StatusDot status={contact.status} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{conversation.name}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {formatConversationTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <Badge className="h-4.5 min-w-4.5 shrink-0 rounded-full px-1.5 text-[10px]">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

function ConversationList({
  conversations,
  contacts,
  activeId,
  onSelect,
  search,
  onSearchChange,
}: {
  conversations: ChatConversation[];
  contacts: ChatContact[];
  activeId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const contactMap = new Map(contacts.map((c) => [c.id, c]));

  const filtered = conversations.filter((conv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      conv.name.toLowerCase().includes(q) ||
      conv.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 p-3">
        <div className="relative">
          <Search className="absolute ltr:left-2.5 rtl:right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ps-9 h-9"
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
          filtered.map((conv) => {
            const contact = conv.type === "dm" ? contactMap.get(conv.participants[0]) : undefined;
            return (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                contact={contact}
                active={conv.id === activeId}
                onSelect={() => onSelect(conv.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function ChatHeaderBar({
  conversation,
  contact,
  onBack,
}: {
  conversation: ChatConversation;
  contact?: ChatContact;
  onBack: () => void;
}) {
  const isGroup = conversation.type === "group";

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
          <AvatarFallback className={cn("text-xs", isGroup && "bg-primary/15 text-primary")}>
            {isGroup ? <Users className="h-4 w-4" /> : contact?.initials ?? "?"}
          </AvatarFallback>
        </Avatar>
        {contact && !isGroup && <StatusDot status={contact.status} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{conversation.name}</p>
        <p className="text-xs text-muted-foreground">
          {isGroup
            ? `${conversation.participants.length + 1} members`
            : contact
              ? statusLabel[contact.status]
              : ""}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Voice call">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Video call">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Conversation info">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
  showSender,
  senderName,
}: {
  message: ChatMessage;
  isOwn: boolean;
  showSender: boolean;
  senderName?: string;
}) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[75%]", isOwn ? "items-end" : "items-start")}>
        {showSender && senderName && (
          <p className="mb-1 px-1 text-[11px] font-medium text-muted-foreground">
            {senderName}
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2",
            isOwn
              ? "rounded-ee-md bg-primary text-primary-foreground"
              : "rounded-es-md bg-muted"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        <div
          className={cn(
            "mt-1 flex items-center gap-1 px-1",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-[10px] text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && (
            message.status === "read" ? (
              <CheckCheck className="h-3 w-3 text-primary" />
            ) : (
              <Check className="h-3 w-3 text-muted-foreground" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex items-center gap-1 rounded-2xl rounded-es-md bg-muted px-3.5 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">{name} is typing...</span>
    </div>
  );
}

function MessageThread({
  messages,
  contacts,
  conversationType,
  isTyping,
  typingName,
}: {
  messages: ChatMessage[];
  contacts: ChatContact[];
  conversationType: ChatConversation["type"];
  isTyping: boolean;
  typingName: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const contactMap = new Map(contacts.map((c) => [c.id, c]));
  const dateGroups = groupMessagesByDate(messages);

  // Track if user is at bottom of scroll
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isTyping]);

  // Scroll to bottom on mount
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
            <div className="space-y-3">
              {msgs.map((msg, i) => {
                const isOwn = msg.senderId === "me";
                const isGroup = conversationType === "group";
                const prevMsg = i > 0 ? msgs[i - 1] : null;
                const showSender = isGroup && !isOwn && msg.senderId !== prevMsg?.senderId;
                const sender = contactMap.get(msg.senderId);

                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={isOwn}
                    showSender={showSender}
                    senderName={sender?.name}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isTyping && (
        <div className="mt-3">
          <TypingIndicator name={typingName} />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
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
        <Button variant="ghost" size="icon-sm" className="shrink-0 mb-0.5" aria-label="Attach file">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button variant="ghost" size="icon-sm" className="shrink-0 mb-0.5" aria-label="Emoji">
          <Smile className="h-4 w-4" />
        </Button>
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
    </div>
  );
}

// ── Main Page ──

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const allContacts = getContacts();
  const allConversations = getConversations();
  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : undefined;
  const activeMessages = activeConversationId
    ? getMessages(activeConversationId)
    : [];
  const activeContact =
    activeConversation?.type === "dm"
      ? getContact(activeConversation.participants[0])
      : undefined;

  const typingName = activeContact?.name ?? activeConversation?.name ?? "";

  const selectConversation = useCallback(
    (id: string) => {
      // Clear pending timeouts from previous conversation
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setIsTyping(false);

      setActiveConversationId(id);
      markConversationRead(id);
      refresh();
    },
    [refresh]
  );

  const handleBack = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsTyping(false);
    setActiveConversationId(null);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!activeConversationId || !activeConversation) return;

      addMessage(activeConversationId, text);
      refresh();

      // Simulate typing indicator then auto-reply
      const responderId =
        activeConversation.type === "dm"
          ? activeConversation.participants[0]
          : activeConversation.participants[
              Math.floor(Math.random() * activeConversation.participants.length)
            ];

      const t1 = setTimeout(() => {
        setIsTyping(true);
      }, 600);

      const t2 = setTimeout(() => {
        setIsTyping(false);
        addReplyMessage(activeConversationId, responderId, getAutoReply());
        refresh();
      }, 2000 + Math.random() * 1500);

      timeoutsRef.current.push(t1, t2);
    },
    [activeConversationId, activeConversation, refresh]
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
          title="Chat"
          description="Messages and conversations."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Chat" },
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
            conversations={allConversations}
            contacts={allContacts}
            activeId={activeConversationId}
            onSelect={selectConversation}
            search={search}
            onSearchChange={setSearch}
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
                contact={activeContact}
                onBack={handleBack}
              />
              <MessageThread
                messages={activeMessages}
                contacts={allContacts}
                conversationType={activeConversation.type}
                isTyping={isTyping}
                typingName={typingName}
              />
              <MessageInput onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<MessageCircle />}
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging."
              />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
