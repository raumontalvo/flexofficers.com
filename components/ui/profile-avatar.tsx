import Image from "next/image";
import { cn } from "@/lib/cn";

export type ProfileAvatarSize = "sm" | "md" | "lg" | "xl";

type ProfileAvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: ProfileAvatarSize;
  className?: string;
};

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-xl",
};

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export function ProfileAvatar({
  name,
  src,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-fo-border-strong bg-fo-bg-elevated font-semibold text-fo-text",
        sizeClasses[size],
        className
      )}
      aria-label={name ? `${name} avatar` : "Profile avatar"}
    >
      {src ? (
        <Image
          src={src}
          alt={name ? `${name} profile photo` : "Profile photo"}
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
