import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveRobotsTagHeader } from "@/lib/seo-robots";

describe("resolveRobotsTagHeader", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns index,follow for public production routes", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(resolveRobotsTagHeader(false)).toBe("index, follow");
  });

  it("returns noindex for private production routes", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(resolveRobotsTagHeader(true)).toBe("noindex, nofollow");
  });

  it("returns noindex on preview deployments", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(resolveRobotsTagHeader(false)).toBe("noindex, nofollow");
  });
});
