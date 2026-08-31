import type { HTMLAttributes } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Send } from "lucide-react";

import { Avatar } from "@repo/ui/components/avatar";
import { MediaThumbnail } from "@repo/ui/components/media";
import { cn } from "@repo/ui/lib/utils";

function InstagramProfile({
  className,
  name,
  username,
  avatar,
  bio,
  followers,
  following,
}: {
  className?: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers?: string;
  following?: string;
}) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <Avatar src={avatar} fallback={name} size="xl" />
      <div className="min-w-0">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground text-sm">@{username}</p>
        {bio ? <p className="mt-2 text-sm">{bio}</p> : null}
        <div className="text-caption text-muted-foreground mt-2 flex gap-4">
          {followers ? <span>{followers} followers</span> : null}
          {following ? <span>{following} following</span> : null}
        </div>
      </div>
    </div>
  );
}

function InstagramComment({
  className,
  author,
  avatar,
  body,
  time,
}: {
  className?: string;
  author: string;
  avatar?: string;
  body: string;
  time?: string;
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Avatar src={avatar} fallback={author} size="xs" />
      <p className="text-sm">
        <span className="font-medium">{author}</span>{" "}
        <span className="text-foreground">{body}</span>
        {time ? <span className="text-caption text-muted-foreground ml-2">{time}</span> : null}
      </p>
    </div>
  );
}

function InstagramPost({
  className,
  username,
  avatar,
  mediaSrc,
  mediaAlt,
  caption,
  likes,
  comments,
}: {
  className?: string;
  username: string;
  avatar?: string;
  mediaSrc?: string;
  mediaAlt?: string;
  caption?: string;
  likes?: string;
  comments?: string;
}) {
  return (
    <article className={cn("border-border bg-card overflow-hidden rounded-xl border", className)}>
      <header className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Avatar src={avatar} fallback={username} size="sm" />
          <span className="text-sm font-medium">{username}</span>
        </div>
        <MoreHorizontal className="text-muted-foreground size-4" aria-hidden />
      </header>
      <MediaThumbnail src={mediaSrc} alt={mediaAlt} ratio="1/1" />
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <Heart className="size-5" aria-hidden />
          <MessageCircle className="size-5" aria-hidden />
          <Send className="size-5" aria-hidden />
        </div>
        <Bookmark className="size-5" aria-hidden />
      </div>
      <div className="space-y-1 px-3 pb-3">
        {likes ? <p className="text-sm font-medium">{likes} likes</p> : null}
        {caption ? (
          <p className="text-sm">
            <span className="font-medium">{username}</span> {caption}
          </p>
        ) : null}
        {comments ? <p className="text-caption text-muted-foreground">{comments}</p> : null}
      </div>
    </article>
  );
}

function InstagramReel({
  className,
  username,
  avatar,
  mediaSrc,
  caption,
  engagement,
}: {
  className?: string;
  username: string;
  avatar?: string;
  mediaSrc?: string;
  caption?: string;
  engagement?: string;
}) {
  return (
    <article
      className={cn("border-border bg-card relative overflow-hidden rounded-xl border", className)}
    >
      <MediaThumbnail src={mediaSrc} alt="" ratio="9/16" className="max-h-[28rem]" />
      <div className="from-foreground/55 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      <div className="absolute bottom-16 right-3 flex flex-col items-center gap-4 text-white">
        <Heart className="size-6" />
        <MessageCircle className="size-6" />
        <Send className="size-6" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-3 text-white">
        <Play className="size-4 shrink-0" aria-hidden />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Avatar src={avatar} fallback={username} size="xs" />
            <span className="text-sm font-medium">{username}</span>
          </div>
          {caption ? <p className="text-caption mt-1 truncate">{caption}</p> : null}
          {engagement ? <p className="text-caption opacity-80">{engagement}</p> : null}
        </div>
      </div>
    </article>
  );
}

function InstagramStory({
  className,
  username,
  avatar,
  seen,
}: {
  className?: string;
  username: string;
  avatar?: string;
  seen?: boolean;
}) {
  return (
    <div className={cn("flex w-16 flex-col items-center gap-1.5", className)}>
      <div className={cn("rounded-full p-0.5", seen ? "bg-border" : "bg-gradient-instagram")}>
        <Avatar src={avatar} fallback={username} size="lg" className="ring-background ring-2" />
      </div>
      <span className="text-caption w-full truncate text-center">{username}</span>
    </div>
  );
}

function SocialMediaPreview({
  className,
  children,
  channel = "instagram",
  ...props
}: HTMLAttributes<HTMLDivElement> & { channel?: "instagram" | "other" }) {
  return (
    <div
      className={cn(
        "bg-card overflow-hidden rounded-xl border",
        channel === "instagram" ? "border-social-instagram/20" : "border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  InstagramProfile,
  InstagramComment,
  InstagramPost,
  InstagramReel,
  InstagramStory,
  SocialMediaPreview,
};
