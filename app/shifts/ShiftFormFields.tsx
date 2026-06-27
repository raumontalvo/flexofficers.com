import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { US_STATES } from "@/lib/license-options";
import {
  SHIFT_ARMED_OPTIONS,
  SHIFT_REQUIREMENT_OPTIONS,
  SHIFT_TIME_TYPE_OPTIONS,
  SHIFT_WORK_TYPE_OPTIONS,
} from "@/lib/shift-form-options";

export type ShiftFormValues = {
  title: string;
  description: string;
  city: string;
  state: string;
  location: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  workType: string;
  shiftTimeType: string;
  armedRequirement: string;
  requirements: string[];
  otherRequirements: string;
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

function ChipToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition",
        checked
          ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-hover"
          : "border-fo-border bg-fo-bg-elevated text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
      )}
    >
      {label}
    </button>
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

  function toggleRequirement(requirement: string) {
    const next = form.requirements.includes(requirement)
      ? form.requirements.filter((entry) => entry !== requirement)
      : [...form.requirements, requirement];

    updateField("requirements", next);
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
          <CardTitle>Location</CardTitle>
          <CardDescription>
            City and state help officers find shifts near them.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="city">City</FieldLabel>
            <input
              id="city"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={fieldClassName}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="state">State</FieldLabel>
            <select
              id="state"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className={fieldClassName}
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="location">Address / site</FieldLabel>
          <input
            id="location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            className={fieldClassName}
            placeholder="Street address or site name"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Pay & staffing</CardTitle>
          <CardDescription>
            Set hourly pay and how many officers you need.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="hourlyRate">Pay (hourly rate)</FieldLabel>
            <input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.hourlyRate}
              onChange={(e) => updateField("hourlyRate", e.target.value)}
              className={fieldClassName}
              placeholder="Min $/hr"
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
          <CardTitle>Schedule</CardTitle>
          <CardDescription>When the shift runs.</CardDescription>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="workType">Work type</FieldLabel>
            <select
              id="workType"
              value={form.workType}
              onChange={(e) => updateField("workType", e.target.value)}
              className={fieldClassName}
            >
              <option value="">Select work type</option>
              {SHIFT_WORK_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="shiftTimeType">Shift time type</FieldLabel>
            <select
              id="shiftTimeType"
              value={form.shiftTimeType}
              onChange={(e) => updateField("shiftTimeType", e.target.value)}
              className={fieldClassName}
            >
              <option value="">Select shift time</option>
              {SHIFT_TIME_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Armed status</CardTitle>
          <CardDescription>
            What armed status is required for this shift?
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="armedRequirement">Armed requirement</FieldLabel>
          <select
            id="armedRequirement"
            value={form.armedRequirement}
            onChange={(e) => updateField("armedRequirement", e.target.value)}
            className={fieldClassName}
          >
            <option value="">Select armed status</option>
            {SHIFT_ARMED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>
            Select certifications and add any other requirements.
          </CardDescription>
        </CardHeader>

        <div className="flex flex-wrap gap-2">
          {SHIFT_REQUIREMENT_OPTIONS.map((requirement) => (
            <ChipToggle
              key={requirement}
              label={requirement}
              checked={form.requirements.includes(requirement)}
              onChange={() => toggleRequirement(requirement)}
            />
          ))}
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="otherRequirements">Other requirements</FieldLabel>
          <textarea
            id="otherRequirements"
            value={form.otherRequirements}
            onChange={(e) => updateField("otherRequirements", e.target.value)}
            className={cn(fieldClassName, "min-h-24 resize-y py-3")}
            placeholder="e.g. Age 21+, valid guard card, site-specific training"
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

export const emptyShiftForm: ShiftFormValues = {
  title: "",
  description: "",
  city: "",
  state: "",
  location: "",
  startTime: "",
  endTime: "",
  hourlyRate: "",
  workType: "",
  shiftTimeType: "",
  armedRequirement: "",
  requirements: [],
  otherRequirements: "",
  reportingInstructions: "",
  positionsNeeded: "1",
};
