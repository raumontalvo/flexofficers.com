import { describe, expect, it } from "vitest";
import {
  EXPERIENCE_CATEGORIES,
  getExperienceCategoryFilterValues,
  normalizeExperienceCategories,
  normalizeExperienceCategory,
} from "@/lib/profile-options";

describe("experience categories", () => {
  it("includes the expanded canonical category list", () => {
    expect(EXPERIENCE_CATEGORIES).toEqual([
      "Retail Security",
      "Event Security",
      "Construction Site Security",
      "Residential Security",
      "Corporate Office Security",
      "Warehouse Security",
      "Hospital Security",
      "School Security",
      "Night Patrol",
      "Access Control",
      "CCTV / Monitoring",
      "Crowd Control",
      "Executive Protection",
      "K9 Security",
      "Military",
      "Law Enforcement",
      "Corrections / Prison Guard",
    ]);
  });

  it("migrates legacy labels to canonical categories", () => {
    expect(normalizeExperienceCategory("Retail security")).toBe("Retail Security");
    expect(normalizeExperienceCategory("Patrol")).toBe("Night Patrol");
    expect(normalizeExperienceCategory("Loss Prevention")).toBe("Retail Security");
  });

  it("deduplicates migrated categories", () => {
    expect(
      normalizeExperienceCategories([
        "Retail",
        "Shopping Mall",
        "Retail security",
      ])
    ).toEqual(["Retail Security"]);
  });

  it("returns search aliases for legacy stored values", () => {
    const values = getExperienceCategoryFilterValues("Retail Security");

    expect(values).toContain("Retail Security");
    expect(values).toContain("Retail security");
    expect(values).toContain("Retail");
  });
});
