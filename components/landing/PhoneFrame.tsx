import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  label: string;
  children: ReactNode;
  className?: string;
  size?: "hero" | "showcase";
  style?: React.CSSProperties;
};

const sizeClasses = {
  hero: "w-[230px] sm:w-[250px]",
  showcase: "w-[260px] sm:w-[300px]",
};

export function PhoneFrame({
  label,
  children,
  className,
  size = "hero",
  style,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "landing-fade-up group flex flex-col items-center gap-4",
        className
      )}
      style={style}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-fo-primary/25 via-blue-500/5 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative rounded-[2.25rem] bg-fo-surface/30 p-2.5 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.2)]",
            sizeClasses[size]
          )}
        >
          <div className="mx-auto mb-2.5 h-1 w-14 rounded-full bg-white/10" />
          <div className="overflow-hidden rounded-[1.65rem] bg-fo-bg">
            {children}
          </div>
        </div>
      </div>
      <p className="text-center text-xs font-medium tracking-wide text-fo-text-subtle">
        {label}
      </p>
    </div>
  );
}
