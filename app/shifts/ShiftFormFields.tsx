import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/cn";

export type ShiftFormValues = {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  specialRequirements: string;
  reportingInstructions: string;
  positionsNeeded: string;
};

const fieldClassName =
  "min-h-12 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-4 py-3 text-base text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
    </label>
  );
}

type ShiftFormFieldsProps = {
  form: ShiftFormValues;
  onChange: (next: ShiftFormValues) => void;
};

export function ShiftFormFields({ form, onChange }: ShiftFormFieldsProps) {
  function updateField<K extends keyof ShiftFormValues>(
    key: K,
    value: ShiftFormValues[K]
  ) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="space-y-4">
      <Card variant="elevated" className="space-y-5">
        <CardHeader>
          <CardTitle>Shift basics</CardTitle>
          <CardDescription>
            Give officers a clear title and overview of the assignment.
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="title">Shift title</FieldLabel>
          <input
            id="title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={fieldClassName}
            placeholder="e.g. Overnight retail security"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={cn(fieldClassName, "min-h-32 resize-y py-3")}
            placeholder="Describe duties, site details, and expectations."
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Pay & staffing</CardTitle>
          <CardDescription>
            Set the hourly rate and how many officers you need.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="hourlyRate">Hourly rate</FieldLabel>
            <input
              id="hourlyRate"
              type="number"
              value={form.hourlyRate}
              onChange={(e) => updateField("hourlyRate", e.target.value)}
              className={fieldClassName}
              placeholder="25.00"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="positionsNeeded">Officers needed</FieldLabel>
            <input
              id="positionsNeeded"
              type="number"
              min="1"
              value={form.positionsNeeded}
              onChange={(e) => updateField("positionsNeeded", e.target.value)}
              className={fieldClassName}
              placeholder="1"
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Schedule & location</CardTitle>
          <CardDescription>
            When the shift runs and where officers should report.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="startTime">Start time</FieldLabel>
            <input
              id="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="endTime">End time</FieldLabel>
            <input
              id="endTime"
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <input
            id="location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            className={fieldClassName}
            placeholder="Address or site name"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>
            List certifications, armed status, or other must-haves.
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="specialRequirements">Special requirements</FieldLabel>
          <textarea
            id="specialRequirements"
            value={form.specialRequirements}
            onChange={(e) => updateField("specialRequirements", e.target.value)}
            className={cn(fieldClassName, "min-h-24 resize-y py-3")}
            placeholder="e.g. Armed, CPR certified, valid guard card"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Accepted officer instructions</CardTitle>
          <CardDescription>
            Reporting details shown only to accepted officers.
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="reportingInstructions">
            Reporting instructions
          </FieldLabel>
          <textarea
            id="reportingInstructions"
            value={form.reportingInstructions}
            onChange={(e) =>
              updateField("reportingInstructions", e.target.value)
            }
            className={cn(fieldClassName, "min-h-24 resize-y py-3")}
            placeholder="Check-in location, contact on arrival, uniform notes..."
          />
        </div>
      </Card>
    </div>
  );
}
