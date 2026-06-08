export type OfficerProfilePayload = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  city?: unknown;
  state?: unknown;
  bio?: unknown;
  experienceYears?: unknown;
  licenses?: unknown;
};

type RawLicenseInput = {
  licenseType?: unknown;
  licenseNumber?: unknown;
  issuingState?: unknown;
  expirationDate?: unknown;
};

export type ParsedLicense = {
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: Date;
};

export type FieldError = {
  field: string;
  message: string;
};

function parseRequiredString(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push({
      field,
      message: `${field} is required`,
    });

    return "";
  }

  return value.trim();
}

export function parseOfficerPayload(payload: OfficerProfilePayload) {
  const errors: FieldError[] = [];

  const firstName = parseRequiredString(payload.firstName, "firstName", errors);
  const lastName = parseRequiredString(payload.lastName, "lastName", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const city = parseRequiredString(payload.city, "city", errors);
  const state = parseRequiredString(payload.state, "state", errors);

  let bio: string | undefined;
  if (typeof payload.bio === "undefined" || payload.bio === null || payload.bio === "") {
    bio = undefined;
  } else if (typeof payload.bio !== "string") {
    errors.push({
      field: "bio",
      message: "bio must be a string",
    });
  } else {
    bio = payload.bio.trim();
  }

  let experienceYears: number | undefined;
  if (
    typeof payload.experienceYears !== "undefined" &&
    payload.experienceYears !== null &&
    payload.experienceYears !== ""
  ) {
    const parsedExperience = Number(payload.experienceYears);

    if (!Number.isFinite(parsedExperience) || parsedExperience < 0) {
      errors.push({
        field: "experienceYears",
        message: "experienceYears must be a non-negative number",
      });
    } else {
      experienceYears = parsedExperience;
    }
  }

  const parsedLicenses: ParsedLicense[] = [];

  if (typeof payload.licenses !== "undefined" && payload.licenses !== null) {
    if (!Array.isArray(payload.licenses)) {
      errors.push({
        field: "licenses",
        message: "licenses must be an array",
      });
    } else {
      payload.licenses.forEach((license, index) => {
        const entry = (license ?? {}) as RawLicenseInput;

        const licenseType =
          typeof entry.licenseType === "string" ? entry.licenseType.trim() : "";
        const licenseNumber =
          typeof entry.licenseNumber === "string" ? entry.licenseNumber.trim() : "";
        const issuingState =
          typeof entry.issuingState === "string" ? entry.issuingState.trim() : "";
        const expirationDateRaw =
          typeof entry.expirationDate === "string" ? entry.expirationDate.trim() : "";

        const isEmptyEntry =
          !licenseType &&
          !licenseNumber &&
          !issuingState &&
          !expirationDateRaw;

        if (isEmptyEntry) {
          return;
        }

        if (!licenseType) {
          errors.push({
            field: `licenses[${index}].licenseType`,
            message: "licenseType is required",
          });
        }

        if (!licenseNumber) {
          errors.push({
            field: `licenses[${index}].licenseNumber`,
            message: "licenseNumber is required",
          });
        }

        if (!issuingState) {
          errors.push({
            field: `licenses[${index}].issuingState`,
            message: "issuingState is required",
          });
        }

        if (!expirationDateRaw) {
          errors.push({
            field: `licenses[${index}].expirationDate`,
            message: "expirationDate is required",
          });

          return;
        }

        const expirationDate = new Date(expirationDateRaw);

        if (Number.isNaN(expirationDate.getTime())) {
          errors.push({
            field: `licenses[${index}].expirationDate`,
            message: "expirationDate must be a valid date",
          });

          return;
        }

        if (licenseType && licenseNumber && issuingState) {
          parsedLicenses.push({
            licenseType,
            licenseNumber,
            issuingState,
            expirationDate,
          });
        }
      });
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      firstName,
      lastName,
      phone,
      city,
      state,
      bio,
      experienceYears,
      licenses: parsedLicenses,
    },
  };
}
