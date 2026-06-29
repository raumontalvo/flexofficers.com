import { cn } from "@/lib/cn";

type OfficerProfileNameProps = {
  firstName: string;
  lastName: string;
  size?: "lg" | "md";
  className?: string;
};

export function officerProfileNameLabel(firstName: string, lastName: string) {
  return [firstName, lastName].filter((part) => part.trim()).join(" ").trim() || "Officer";
}

export function OfficerProfileName({
  firstName,
  lastName,
  size = "lg",
  className,
}: OfficerProfileNameProps) {
  const sizeClass = size === "lg" ? "text-xl sm:text-2xl" : "text-lg";
  const hasFirst = Boolean(firstName.trim());
  const hasLast = Boolean(lastName.trim());

  if (!hasFirst && !hasLast) {
    return (
      <p className={cn(sizeClass, "font-bold text-fo-text-muted", className)}>
        Name not provided
      </p>
    );
  }

  return (
    <div className={cn("space-y-0.5", className)}>
      {hasFirst ? (
        <p className={cn(sizeClass, "font-bold leading-tight text-fo-text")}>
          {firstName}
        </p>
      ) : null}
      {hasLast ? (
        <p className={cn(sizeClass, "font-bold leading-tight text-fo-text")}>
          {lastName}
        </p>
      ) : null}
    </div>
  );
}
