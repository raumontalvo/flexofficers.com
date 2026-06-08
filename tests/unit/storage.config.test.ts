import { describe, expect, it } from "vitest";
import { getStorageConfig } from "@/lib/storage";

describe("getStorageConfig", () => {
  it("parses valid S3 config with defaults", () => {
    const config = getStorageConfig({
      STORAGE_PROVIDER: "s3",
      STORAGE_BUCKET: "flexofficers-docs",
      STORAGE_REGION: "us-east-1",
      STORAGE_ACCESS_KEY_ID: "key",
      STORAGE_SECRET_ACCESS_KEY: "secret",
    });

    expect(config.provider).toBe("s3");
    expect(config.bucket).toBe("flexofficers-docs");
    expect(config.forcePathStyle).toBe(false);
    expect(config.uploadPrefix).toBe("licenses");
    expect(config.maxUploadBytes).toBe(5 * 1024 * 1024);
    expect(config.allowedMimeTypes).toEqual([
      "application/pdf",
      "image/jpeg",
      "image/png",
    ]);
  });

  it("requires endpoint for R2", () => {
    expect(() =>
      getStorageConfig({
        STORAGE_PROVIDER: "r2",
        STORAGE_BUCKET: "flexofficers-docs",
        STORAGE_REGION: "auto",
        STORAGE_ACCESS_KEY_ID: "key",
        STORAGE_SECRET_ACCESS_KEY: "secret",
      })
    ).toThrow("STORAGE_ENDPOINT is required when STORAGE_PROVIDER is 'r2'");
  });
});
