"use client";

import * as React from "react";

import { AIAvatar, AIMessage, ThinkingIndicator } from "@repo/ui/components/ai";
import { Avatar } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";

export type ConversationVariant = "instagram" | "ai" | "system" | "internal";

function Conversation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border bg-card flex min-h-80 flex-col overflow-hidden rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

function ConversationHeader({
  className,
  title,
  subtitle,
  avatar,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  avatar?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-3 border-b px-4 py-3", className)} {...props}>
      {avatar}
      <div className="min-w-0">
        {title ? <p className="truncate text-sm font-medium">{title}</p> : null}
        {subtitle ? (
          <p className="text-caption text-muted-foreground truncate">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function MessageList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("scrollbar-thin flex flex-1 flex-col gap-3 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

const bubbleVariant: Record<ConversationVariant, string> = {
  instagram: "bg-subtle text-foreground rounded-lg rounded-tl-sm",
  ai: "border border-ai-border bg-ai-subtle rounded-lg rounded-tl-sm",
  system: "bg-transparent text-muted-foreground text-caption text-center w-full",
  internal: "bg-muted text-foreground rounded-lg",
};

function MessageBubble({
  className,
  variant = "internal",
  align = "start",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: ConversationVariant;
  align?: "start" | "end";
}) {
  if (variant === "system") {
    return (
      <div className={cn(bubbleVariant.system, "py-1", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("animate-message-enter flex max-w-[85%]", align === "end" && "ml-auto")}>
      <div className={cn("px-3 py-2 text-sm", bubbleVariant[variant], className)} {...props}>
        {children}
      </div>
    </div>
  );
}

function UserMessage({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-message-enter ml-auto flex max-w-[85%] items-end gap-2", className)}
    >
      <div
        className="bg-primary text-primary-foreground rounded-lg rounded-tr-sm px-3 py-2 text-sm"
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function SystemMessage({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-caption text-muted-foreground text-center", className)} {...props} />
  );
}

function MessageComposer({
  className,
  placeholder = "Write a reply…",
  onSend,
  disabled,
}: {
  className?: string;
  placeholder?: string;
  onSend?: (value: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState("");

  function submit() {
    const next = value.trim();
    if (!next) return;
    onSend?.(next);
    setValue("");
  }

  return (
    <div className={cn("flex items-end gap-2 border-t p-3", className)}>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-11 resize-none"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <Button size="sm" disabled={disabled || !value.trim()} onClick={submit}>
        Send
      </Button>
    </div>
  );
}

function TypingIndicator({ className, name = "AI" }: { className?: string; name?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AIAvatar size="xs" />
      <ThinkingIndicator label={`${name} is typing…`} />
    </div>
  );
}

function ConversationThread({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}

function ConversationPreview({
  className,
  name,
  preview,
  time,
  unread,
  avatar,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  name: string;
  preview: string;
  time?: string;
  unread?: boolean;
  avatar?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "hover:bg-subtle focus-visible:ring-ring flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2",
        unread && "bg-brand-subtle/60",
        className,
      )}
      {...props}
    >
      <Avatar src={avatar} fallback={name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{name}</p>
          {time ? <span className="text-caption text-muted-foreground">{time}</span> : null}
        </div>
        <p className="text-caption text-muted-foreground truncate">{preview}</p>
      </div>
    </button>
  );
}

export {
  Conversation,
  ConversationHeader,
  MessageList,
  MessageBubble,
  UserMessage,
  AIMessage,
  SystemMessage,
  MessageComposer,
  TypingIndicator,
  ConversationThread,
  ConversationPreview,
};
