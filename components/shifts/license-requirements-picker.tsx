"use client";

import {
  POST_SHIFT_LICENSE_OPTIONS,
  type PostShiftLicenseOption,
} from "@/lib/shift-create-form";
import { RequirementsMultiSelectPicker } from "@/components/shifts/requirements-multi-select-picker";

type LicenseRequirementsPickerProps = {
  selected: PostShiftLicenseOption[];
  onChange: (next: PostShiftLicenseOption[]) => void;
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
    />
  );
}
