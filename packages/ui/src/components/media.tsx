import type { HTMLAttributes } from "react";

import { cn } from "@repo/ui/lib/utils";

export type MediaRatio = "1/1" | "4/5" | "9/16" | "16/9";

const ratioClass: Record<MediaRatio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "9/16": "aspect-[9/16]",
  "16/9": "aspect-video",
};

function MediaThumbnail({
  className,
  src,
  alt = "",
  ratio = "1/1",
}: {
  className?: string;
  src?: string;
  alt?: string;
  ratio?: MediaRatio;
}) {
  return (
    <div className={cn("bg-muted overflow-hidden", ratioClass[ratio], className)}>
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <div className="text-caption text-muted-foreground flex size-full items-center justify-center">
          Media
        </div>
      )}
    </div>
  );
}

function MediaCard({
  className,
  children,
  ratio = "1/1",
  src,
  alt,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ratio?: MediaRatio;
  src?: string;
  alt?: string;
}) {
  return (
    <div
      className={cn("border-border bg-card shadow-xs overflow-hidden rounded-xl border", className)}
      {...props}
    >
      <MediaThumbnail src={src} alt={alt} ratio={ratio} />
      {children}
    </div>
  );
}

function MediaPreview({
  className,
  src,
  alt,
  ratio = "16/9",
}: {
  className?: string;
  src?: string;
  alt?: string;
  ratio?: MediaRatio;
}) {
  return (
    <div className={cn("border-border overflow-hidden rounded-xl border", className)}>
      <MediaThumbnail src={src} alt={alt} ratio={ratio} />
    </div>
  );
}

function VideoPreview({
  className,
  src,
  poster,
  ratio = "9/16",
}: {
  className?: string;
  src?: string;
  poster?: string;
  ratio?: MediaRatio;
}) {
  if (!src) {
    return <MediaThumbnail src={poster} alt="" ratio={ratio} className={className} />;
  }

  return (
    <div className={cn("bg-foreground overflow-hidden", ratioClass[ratio], className)}>
      <video className="size-full object-cover" src={src} poster={poster} controls playsInline />
    </div>
  );
}

export { MediaThumbnail, MediaCard, MediaPreview, VideoPreview };
