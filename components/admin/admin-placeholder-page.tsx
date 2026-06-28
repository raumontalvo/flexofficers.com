import { Card } from "@/components/ui";

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-fo-text-muted">{description}</p>
      </div>

      <Card variant="muted" className="fo-glass-card border border-white/10">
        <p className="text-sm text-fo-text-muted">Coming soon.</p>
      </Card>
    </div>
  );
}
