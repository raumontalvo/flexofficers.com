"use client";

import {
  POST_SHIFT_LICENSE_OPTIONS,
  type PostShiftRequirementValue,
} from "@/lib/shift-create-form";
import { RequirementsMultiSelectPicker } from "@/components/shifts/requirements-multi-select-picker";

type LicenseRequirementsPickerProps = {
  selected: PostShiftRequirementValue[];
  onChange: (next: PostShiftRequirementValue[]) => void;
};

export function LicenseRequirementsPicker({
  selected,
  onChange,
}: LicenseRequirementsPickerProps) {
  return (
    <RequirementsMultiSelectPicker
      options={POST_SHIFT_LICENSE_OPTIONS}
      selected={selected}
      onChange={onChange}
      allowCustom
      customLabel="Add a custom license requirement"
      customPlaceholder="e.g. Class D Guard Card"
    />
  );
}
