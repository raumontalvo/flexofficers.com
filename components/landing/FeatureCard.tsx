import type { ComponentType, SVGProps } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
}: FeatureCardProps) {
  return (
    <Card
      variant="elevated"
      className={cn(
        "landing-card-lift h-full border-white/[0.04] bg-fo-surface/35 p-7 shadow-[0_16px_48px_-28px_rgba(0,0,0,0.65)]",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fo-primary/15 text-fo-primary-bright">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <CardTitle className="mt-5 text-lg font-semibold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="mt-3 text-sm leading-relaxed text-fo-text-subtle">
        {description}
      </CardDescription>
    </Card>
  );
}
