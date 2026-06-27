import { cn } from "@/lib/cn";

const LICENSE_DISPLAY: Record<
  string,
  { icon: string; shortLabel: string; badgeClass: string }
> = {
  "Armed Security": {
    icon: "🔫",
    shortLabel: "G License",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  "Executive Protection": {
    icon: "🔫",
    shortLabel: "G License",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  "Unarmed Security": {
    icon: "🛡️",
    shortLabel: "D License",
    badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  "Security Guard": {
    icon: "🛡️",
    shortLabel: "D License",
    badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  "K9 Security": {
    icon: "🐕",
    shortLabel: "K9 License",
    badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  },
  Other: {
    icon: "📄",
    shortLabel: "License",
    badgeClass: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  },
};

const DEFAULT_LICENSE_DISPLAY = {
  icon: "📄",
  shortLabel: "License",
  badgeClass: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

export function getLicenseDisplayMeta(licenseType: string) {
  if (!licenseType.trim()) {
    return DEFAULT_LICENSE_DISPLAY;
  }

  return LICENSE_DISPLAY[licenseType] ?? {
    ...DEFAULT_LICENSE_DISPLAY,
    shortLabel: licenseType,
  };
}

export function formatLicenseExpiration(value: string) {
  if (!value.trim()) {
    return "—";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${month}/${day}/${year}`;
}

export function LicenseTypeBadge({
  licenseType,
  className,
}: {
  licenseType: string;
  className?: string;
}) {
  const meta = getLicenseDisplayMeta(licenseType);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold",
        meta.badgeClass,
        className
      )}
    >
      <span aria-hidden>{meta.icon}</span>
      <span>{meta.shortLabel}</span>
    </span>
  );
}
