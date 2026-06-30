export type JobPageSlugInput = {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  location: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getShiftIdSuffixFromUuid(id: string) {
  return id.split("-")[0]?.toLowerCase() ?? id.slice(0, 8).toLowerCase();
}

export function buildJobPageSlug(input: JobPageSlugInput) {
  const titlePart = slugify(input.title) || "security-shift";
  const cityPart =
    slugify(input.city?.trim() || "") ||
    slugify(input.location.split(",")[0]?.trim() || "") ||
    "location";
  const statePart = slugify(input.state?.trim() || "");
  const idSuffix = getShiftIdSuffixFromUuid(input.id);

  const parts = [titlePart, cityPart];

  if (statePart) {
    parts.push(statePart);
  }

  parts.push(idSuffix);

  return parts.join("-");
}

export function parseShiftIdPrefixFromJobSlug(slug: string) {
  const match = slug.match(/-([a-f0-9]{8})$/i);
  return match?.[1]?.toLowerCase() ?? null;
}
