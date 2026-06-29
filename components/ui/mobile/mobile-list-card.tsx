import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MobileListCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
};

export function MobileListCardGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MobileListCard({
  children,
  className,
  onClick,
  selected = false,
}: MobileListCardProps) {
  const interactive = Boolean(onClick);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  const sharedClassName = cn(
    "space-y-3 px-4 py-4 transition",
    interactive && "cursor-pointer hover:bg-white/[0.03]",
    selected && "bg-blue-500/[0.06]",
    className
  );

  if (interactive) {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={sharedClassName}
      >
        {children}
      </article>
    );
  }

  return <article className={sharedClassName}>{children}</article>;
}

export function MobileListCardActions({
  children,
  className,
  stopPropagation = true,
}: {
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      onClick={stopPropagation ? (event) => event.stopPropagation() : undefined}
      onKeyDown={stopPropagation ? (event) => event.stopPropagation() : undefined}
    >
      {children}
    </div>
  );
}
