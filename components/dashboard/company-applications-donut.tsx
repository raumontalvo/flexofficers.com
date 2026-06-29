import { Card } from "@/components/ui";

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type CompanyApplicationsDonutProps = {
  pendingCount: number;
  invitedCount: number;
  acceptedCount: number;
};

function buildSegments({
  pendingCount,
  invitedCount,
  acceptedCount,
}: CompanyApplicationsDonutProps): DonutSegment[] {
  return [
    { label: "Pending", value: pendingCount, color: "#3b82f6" },
    { label: "Invited", value: invitedCount, color: "#f59e0b" },
    { label: "Accepted", value: acceptedCount, color: "#10b981" },
  ];
}

function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-36 w-36 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.02]">
        <span className="text-xs text-fo-text-muted">No data</span>
      </div>
    );
  }

  let cumulative = 0;
  const gradientStops = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const start = (cumulative / total) * 100;
      cumulative += segment.value;
      const end = (cumulative / total) * 100;
      return `${segment.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div
      className="relative h-36 w-36 rounded-full"
      style={{
        background: `conic-gradient(${gradientStops})`,
      }}
    >
      <div className="absolute inset-5 flex items-center justify-center rounded-full bg-[#07101c]">
        <div className="text-center">
          <p className="text-2xl font-bold text-fo-text">{total}</p>
          <p className="text-[10px] uppercase tracking-wide text-fo-text-muted">
            Total
          </p>
        </div>
      </div>
    </div>
  );
}

export function CompanyApplicationsDonut(props: CompanyApplicationsDonutProps) {
  const segments = buildSegments(props);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card h-full border border-white/10 p-4"
    >
      <h2 className="text-base font-bold text-fo-text">Applicants Overview</h2>

      {total === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
          <DonutChart segments={segments} />
          <p className="mt-4 text-sm text-fo-text-muted">
            Applicant and invite activity will appear here once officers apply
            or accept your invites.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <DonutChart segments={segments} />
          <ul className="space-y-2 text-sm">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-fo-text-muted">{segment.label}</span>
                <span className="font-semibold text-fo-text">{segment.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
