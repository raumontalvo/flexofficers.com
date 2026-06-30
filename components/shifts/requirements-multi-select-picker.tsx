"use client";

import { useState } from "react";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

const CUSTOM_ITEM_MAX_LENGTH = 80;

type RequirementsMultiSelectPickerProps<T extends string> = {
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
  allowCustom?: boolean;
  customLabel?: string;
  customPlaceholder?: string;
  addButtonLabel?: string;
};

export function RequirementsMultiSelectPicker<T extends string>({
  options,
  selected,
  onChange,
  allowCustom = false,
  customLabel = "Add your own",
  customPlaceholder = "Type a custom option",
  addButtonLabel = "Add",
}: RequirementsMultiSelectPickerProps<T>) {
  const [customValue, setCustomValue] = useState("");
  const optionSet = new Set<string>(options);
  const customSelected = selected.filter((entry) => !optionSet.has(entry));

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

  function addCustomOption() {
    const trimmed = customValue.trim();

    if (!trimmed || trimmed.length > CUSTOM_ITEM_MAX_LENGTH) {
      return;
    }

    if (selected.includes(trimmed as T)) {
      setCustomValue("");
      return;
    }

    onChange([...selected, trimmed as T]);
    setCustomValue("");
  }

  return (
    <div className="min-w-0 space-y-3">
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

      <div className="w-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-2">
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

      {allowCustom ? (
        <div className="space-y-2">
          {customSelected.length > 0 ? (
            <p className="text-xs text-fo-text-muted">
              {customSelected.length} custom{" "}
              {customSelected.length === 1 ? "entry" : "entries"} selected
            </p>
          ) : null}
          <p className="text-xs font-medium text-fo-text-muted">{customLabel}</p>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <input
              value={customValue}
              onChange={(event) => setCustomValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomOption();
                }
              }}
              placeholder={customPlaceholder}
              maxLength={CUSTOM_ITEM_MAX_LENGTH}
              className="box-border min-h-10 w-full max-w-full min-w-0 rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20"
            />
            <button
              type="button"
              onClick={addCustomOption}
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "shrink-0",
              })}
            >
              {addButtonLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
