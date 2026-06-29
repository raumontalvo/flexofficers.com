import {
  SHIFT_TIME_TYPE_OPTIONS,
  SHIFT_WORK_TYPE_OPTIONS,
  type ShiftTimeTypeFormValue,
} from "@/lib/shift-form-options";
import { ShiftVisibility } from "@/app/generated/prisma/enums";

export type ShiftPostVisibility = "PUBLIC" | "STAFF_ONLY";

export const POST_SHIFT_LICENSE_OPTIONS = [
  "Armed Security",
  "Unarmed Security",
  "Security Guard",
  "Executive Protection",
  "K9 Security",
  "Other",
] as const;

export type PostShiftLicenseOption =
  (typeof POST_SHIFT_LICENSE_OPTIONS)[number];

export const POST_SHIFT_CERTIFICATION_OPTIONS = [
  "CPR / First Aid",
  "AED",
  "Baton Certification",
  "Handcuffing",
  "Firearms Qualification",
  "Taser",
  "ASP / Expandable Baton",
  "OC / Pepper Spray",
] as const;

export type PostShiftCertificationOption =
  (typeof POST_SHIFT_CERTIFICATION_OPTIONS)[number];

const CERTIFICATION_TO_REQUIREMENT_CHIP: Partial<
  Record<PostShiftCertificationOption, string>
> = {
  "CPR / First Aid": "CPR",
  AED: "AED",
  "Firearms Qualification": "Firearms",
};

export type PostShiftFormValues = {
  title: string;
  workType: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hourlyRate: string;
  currency: string;
  licenseRequirements: PostShiftLicenseOption[];
  certificationRequirements: PostShiftCertificationOption[];
  otherRequirements: string;
  positionsNeeded: number;
  visibility: ShiftPostVisibility;
};

export const emptyPostShiftForm: PostShiftFormValues = {
  title: "",
  workType: "",
  description: "",
  startDate: "",
  startTime: "",
  endTime: "",
  locationName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  hourlyRate: "",
  currency: "USD",
  licenseRequirements: [],
  certificationRequirements: [],
  otherRequirements: "",
  positionsNeeded: 1,
  visibility: "PUBLIC",
};

export function combineDateAndTime(date: string, time: string) {
  if (!date.trim() || !time.trim()) {
    return null;
  }

  const combined = new Date(`${date}T${time}`);

  if (Number.isNaN(combined.getTime())) {
    return null;
  }

  return combined;
}

export function buildShiftDateTimes(form: Pick<
  PostShiftFormValues,
  "startDate" | "startTime" | "endTime"
>) {
  const start = combineDateAndTime(form.startDate, form.startTime);

  if (!start) {
    return { startTime: null, endTime: null };
  }

  const endSameDay = combineDateAndTime(form.startDate, form.endTime);

  if (!endSameDay) {
    return { startTime: start, endTime: null };
  }

  const end =
    endSameDay <= start
      ? new Date(endSameDay.getTime() + 24 * 60 * 60 * 1000)
      : endSameDay;

  return { startTime: start, endTime: end };
}

export function deriveShiftTimeType(
  start: Date,
  end: Date
): ShiftTimeTypeFormValue {
  const startHour = start.getHours();
  const crossesMidnight = end.getDate() !== start.getDate() || end <= start;

  if (crossesMidnight || startHour >= 22 || startHour < 5) {
    return "Overnight";
  }

  if (startHour >= 6 && startHour < 18) {
    return "Day Shift";
  }

  return "Night Shift";
}

export function buildShiftLocation(form: Pick<
  PostShiftFormValues,
  "locationName" | "address" | "zipCode"
>) {
  const name = form.locationName.trim();
  const address = form.address.trim();
  const zip = form.zipCode.trim();

  const addressLine = [address, zip].filter(Boolean).join(", ");

  if (name && addressLine) {
    return `${name} | ${addressLine}`;
  }

  return name || addressLine;
}

export function mapLicenseRequirements(
  licenseRequirements: readonly PostShiftLicenseOption[]
) {
  const selected = [...new Set(licenseRequirements)];
  const requirementChips: string[] = [];

  for (const requirement of selected) {
    if (requirement === "K9 Security") {
      requirementChips.push("K9");
    }
  }

  const hasArmedType = selected.some((requirement) =>
    ["Armed Security", "Executive Protection"].includes(requirement)
  );
  const hasUnarmedType = selected.some((requirement) =>
    ["Unarmed Security", "Security Guard"].includes(requirement)
  );

  let armedRequirement = "Either";

  if (hasArmedType && !hasUnarmedType) {
    armedRequirement = "Armed";
  } else if (hasUnarmedType && !hasArmedType) {
    armedRequirement = "Unarmed";
  }

  return {
    requirementChips: [...new Set(requirementChips)],
    licenseLabels: selected,
    armedRequirement,
  };
}

export function mapCertificationRequirements(
  certificationRequirements: readonly PostShiftCertificationOption[]
) {
  const selected = [...new Set(certificationRequirements)];
  const requirementChips: string[] = [];
  const unmappedLabels: PostShiftCertificationOption[] = [];

  for (const certification of selected) {
    const chip = CERTIFICATION_TO_REQUIREMENT_CHIP[certification];

    if (chip) {
      requirementChips.push(chip);
    } else {
      unmappedLabels.push(certification);
    }
  }

  return {
    requirementChips: [...new Set(requirementChips)],
    unmappedLabels,
  };
}

export function buildCertificationRequirementsText(
  unmappedLabels: readonly PostShiftCertificationOption[]
) {
  if (unmappedLabels.length === 0) {
    return "";
  }

  return `Certification requirements: ${unmappedLabels.join(", ")}`;
}

export function buildLicenseRequirementsText(
  licenseRequirements: readonly PostShiftLicenseOption[]
) {
  if (licenseRequirements.length === 0) {
    return "";
  }

  return `License requirements: ${licenseRequirements.join(", ")}`;
}

export function buildShiftApiPayload(
  form: PostShiftFormValues
):
  | { error: string; payload?: never }
  | { payload: Record<string, unknown>; error?: never } {
  const { startTime, endTime } = buildShiftDateTimes(form);

  if (!startTime || !endTime) {
    return { error: "Start date, start time, and end time are required." } as const;
  }

  if (form.licenseRequirements.length === 0) {
    return {
      error: "Select at least one license requirement.",
    } as const;
  }

  if (form.positionsNeeded < 1) {
    return { error: "Open positions must be at least 1." } as const;
  }

  const licenseMapping = mapLicenseRequirements(form.licenseRequirements);
  const certificationMapping = mapCertificationRequirements(
    form.certificationRequirements
  );
  const shiftTimeType = deriveShiftTimeType(startTime, endTime);
  const location = buildShiftLocation(form);
  const licenseRequirementsText = buildLicenseRequirementsText(
    form.licenseRequirements
  );
  const certificationRequirementsText = buildCertificationRequirementsText(
    certificationMapping.unmappedLabels
  );
  const otherRequirementsParts = [
    licenseRequirementsText,
    certificationRequirementsText,
    form.otherRequirements.trim(),
  ].filter(Boolean);
  const requirementChips = [
    ...new Set([
      ...licenseMapping.requirementChips,
      ...certificationMapping.requirementChips,
    ]),
  ];

  return {
    payload: {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      location,
      city: form.city.trim(),
      state: form.state.trim(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      hourlyRate: form.hourlyRate,
      workType: form.workType,
      shiftTimeType,
      armedRequirement: licenseMapping.armedRequirement,
      requirements: requirementChips,
      otherRequirements:
        otherRequirementsParts.length > 0
          ? otherRequirementsParts.join("; ")
          : undefined,
      positionsNeeded: String(form.positionsNeeded),
      visibility:
        form.visibility === "STAFF_ONLY"
          ? ShiftVisibility.STAFF_ONLY
          : ShiftVisibility.PUBLIC,
    },
  };
}

export function calculateShiftHours(
  form: Pick<PostShiftFormValues, "startDate" | "startTime" | "endTime">
) {
  const { startTime, endTime } = buildShiftDateTimes(form);

  if (!startTime || !endTime) {
    return null;
  }

  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  return hours > 0 ? hours : null;
}

export function calculateEstimatedShiftTotal(form: PostShiftFormValues) {
  const rate = Number(form.hourlyRate);
  const hours = calculateShiftHours(form);

  if (!Number.isFinite(rate) || rate <= 0 || !hours) {
    return 0;
  }

  return rate * hours * form.positionsNeeded;
}

export function formatCurrencyAmount(
  amount: number,
  currency: string = "USD"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPostShiftDateTime(form: PostShiftFormValues) {
  const { startTime, endTime } = buildShiftDateTimes(form);

  if (!startTime || !endTime) {
    return "";
  }

  const dateLabel = startTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const startLabel = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endLabel = endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateLabel} · ${startLabel} – ${endLabel}`;
}

export function formatPostShiftLocation(form: PostShiftFormValues) {
  const cityState = [form.city.trim(), form.state.trim()]
    .filter(Boolean)
    .join(", ");

  const parts = [
    form.locationName.trim(),
    form.address.trim(),
    form.zipCode.trim(),
    cityState,
  ].filter(Boolean);

  return parts.join(" · ");
}

export function getWorkTypeLabel(value: string) {
  return (
    SHIFT_WORK_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function getShiftSummaryFields(form: PostShiftFormValues) {
  return {
    typeOfPost: form.workType ? getWorkTypeLabel(form.workType) : "Not set",
    dateTime: formatPostShiftDateTime(form) || "Not set",
    location: formatPostShiftLocation(form) || "Not set",
    payRate:
      form.hourlyRate.trim() && Number(form.hourlyRate) > 0
        ? `${formatCurrencyAmount(Number(form.hourlyRate), form.currency)}/hr`
        : "Not set",
    licenseRequirements: form.licenseRequirements,
    certificationRequirements: form.certificationRequirements,
    openPositions: String(form.positionsNeeded),
    description: form.description.trim() || "Not set",
    visibility:
      form.visibility === "STAFF_ONLY"
        ? "Private post for staff"
        : "Public post shift",
  };
}

const REQUIREMENT_CHIP_TO_CERTIFICATION: Record<
  string,
  PostShiftCertificationOption
> = {
  CPR: "CPR / First Aid",
  AED: "AED",
  Firearms: "Firearms Qualification",
};

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function splitShiftDateTimes(startTime: Date, endTime: Date) {
  return {
    startDate: formatDateInputValue(startTime),
    startTime: formatTimeInputValue(startTime),
    endTime: formatTimeInputValue(endTime),
  };
}

export function parseShiftLocationFields(location: string) {
  const [namePart, addressPart] = location.split("|").map((part) => part.trim());

  if (!location.includes("|")) {
    return {
      locationName: "",
      address: location.trim(),
      zipCode: "",
    };
  }

  const zipMatch = addressPart.match(/,\s*(\d{5}(?:-\d{4})?)$/);
  const zipCode = zipMatch?.[1] ?? "";
  const address = zipMatch
    ? addressPart.slice(0, zipMatch.index).trim().replace(/,\s*$/, "")
    : addressPart;

  return {
    locationName: namePart,
    address,
    zipCode,
  };
}

export function parseLicenseRequirementsFromShift(input: {
  requirements: readonly string[];
  otherRequirements?: string | null;
  armedRequirement?: string | null;
}) {
  const licenses = new Set<PostShiftLicenseOption>();
  const otherRequirements = input.otherRequirements ?? "";
  const licenseMatch = otherRequirements.match(/License requirements:\s*([^;]+)/);

  if (licenseMatch) {
    for (const label of licenseMatch[1].split(",").map((entry) => entry.trim())) {
      if (
        POST_SHIFT_LICENSE_OPTIONS.includes(label as PostShiftLicenseOption)
      ) {
        licenses.add(label as PostShiftLicenseOption);
      }
    }
  }

  if (input.requirements.includes("K9")) {
    licenses.add("K9 Security");
  }

  if (licenses.size === 0) {
    if (input.armedRequirement === "Armed") {
      licenses.add("Armed Security");
    } else if (input.armedRequirement === "Unarmed") {
      licenses.add("Unarmed Security");
    }
  }

  return [...licenses];
}

export function parseCertificationRequirementsFromShift(input: {
  requirements: readonly string[];
  otherRequirements?: string | null;
}) {
  const certifications = new Set<PostShiftCertificationOption>();

  for (const requirement of input.requirements) {
    const certification = REQUIREMENT_CHIP_TO_CERTIFICATION[requirement];

    if (certification) {
      certifications.add(certification);
    }
  }

  const otherRequirements = input.otherRequirements ?? "";
  const certificationMatch = otherRequirements.match(
    /Certification requirements:\s*([^;]+)/
  );

  if (certificationMatch) {
    for (const label of certificationMatch[1]
      .split(",")
      .map((entry) => entry.trim())) {
      if (
        POST_SHIFT_CERTIFICATION_OPTIONS.includes(
          label as PostShiftCertificationOption
        )
      ) {
        certifications.add(label as PostShiftCertificationOption);
      }
    }
  }

  return [...certifications];
}

export function parseFreeformOtherRequirements(
  otherRequirements?: string | null
) {
  if (!otherRequirements?.trim()) {
    return "";
  }

  return otherRequirements
    .split(";")
    .map((part) => part.trim())
    .filter(
      (part) =>
        !part.startsWith("License requirements:") &&
        !part.startsWith("Certification requirements:")
    )
    .join("; ")
    .trim();
}

export function shiftToPostShiftFormValues(input: {
  title: string;
  description?: string | null;
  location: string;
  city?: string | null;
  state?: string | null;
  startTime: Date;
  endTime: Date;
  hourlyRate: { toString: () => string };
  workType: string;
  requirements: readonly string[];
  otherRequirements?: string | null;
  armedRequirement?: string | null;
  positionsNeeded: number;
  visibility?: ShiftPostVisibility;
}): PostShiftFormValues {
  const { locationName, address, zipCode } = parseShiftLocationFields(
    input.location
  );
  const { startDate, startTime, endTime } = splitShiftDateTimes(
    input.startTime,
    input.endTime
  );

  return {
    title: input.title,
    workType: input.workType,
    description: input.description ?? "",
    startDate,
    startTime,
    endTime,
    locationName,
    address,
    city: input.city ?? "",
    state: input.state ?? "",
    zipCode,
    hourlyRate: input.hourlyRate.toString(),
    currency: "USD",
    licenseRequirements: parseLicenseRequirementsFromShift({
      requirements: input.requirements,
      otherRequirements: input.otherRequirements,
      armedRequirement: input.armedRequirement,
    }),
    certificationRequirements: parseCertificationRequirementsFromShift({
      requirements: input.requirements,
      otherRequirements: input.otherRequirements,
    }),
    otherRequirements: parseFreeformOtherRequirements(input.otherRequirements),
    positionsNeeded: Math.max(1, input.positionsNeeded),
    visibility: input.visibility ?? "PUBLIC",
  };
}

export function buildShiftUpdatePayload(
  form: PostShiftFormValues,
  options: { shiftId: string; reportingInstructions?: string | null }
):
  | { error: string; payload?: never }
  | { payload: Record<string, unknown>; error?: never } {
  const built = buildShiftApiPayload(form);

  if (!("payload" in built)) {
    return built;
  }

  const payload: Record<string, unknown> = {
    shiftId: options.shiftId,
    ...built.payload,
  };

  if (options.reportingInstructions?.trim()) {
    payload.reportingInstructions = options.reportingInstructions.trim();
  }

  return { payload };
}
