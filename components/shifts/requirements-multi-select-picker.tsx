"use client";

import { cn } from "@/lib/cn";

type RequirementsMultiSelectPickerProps<T extends string> = {
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
};

export function RequirementsMultiSelectPicker<T extends string>({
  options,
  selected,
  onChange,
}: RequirementsMultiSelectPickerProps<T>) {
  function toggleOption(option: T) {
    if (selected.includes(option)) {
      onChange(selected.filter((entry) => entry !== option));
      return;
    }

    onChange([...selected, option]);
  }

  function removeOption(option: T) {
    onChange(selected.filter((entry) => entry !== option));
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((option) => (
            <span
              key={option}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-100"
            >
              {option}
              <button
                type="button"
                onClick={() => removeOption(option)}
                className="rounded-full px-1 text-blue-200/80 transition hover:bg-blue-500/20 hover:text-white"
                aria-label={`Remove ${option}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
        <div className="grid gap-1">
          {options.map((option) => {
            const isSelected = selected.includes(option);

            return (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition",
                  isSelected
                    ? "bg-blue-500/10 text-fo-text"
                    : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option)}
                  className="rounded border-fo-border text-fo-primary-bright focus:ring-fo-primary-bright/30"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
