export type StorageProvider = "s3" | "r2";

export type StorageConfig = {
  provider: StorageProvider;
  bucket: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  accessKeyId: string;
  secretAccessKey: string;
  uploadPrefix: string;
  maxUploadBytes: number;
  allowedMimeTypes: string[];
  uploadPresignTtlSeconds: number;
  downloadPresignTtlSeconds: number;
};

type EnvLike = Record<string, string | undefined>;

function requireEnv(env: EnvLike, key: string) {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (typeof value === "undefined") {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

function parsePositiveInt(
  value: string | undefined,
  defaultValue: number,
  key: string
) {
  if (typeof value === "undefined" || value.trim() === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }

  return parsed;
}

function parseMimeList(value: string | undefined) {
  if (typeof value === "undefined" || value.trim() === "") {
    return ["application/pdf", "image/jpeg", "image/png"];
  }

  const values = value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error("LICENSE_UPLOAD_ALLOWED_MIME must include at least one value");
  }

  return values;
}

export function getStorageConfig(env: EnvLike = process.env): StorageConfig {
  const providerRaw = requireEnv(env, "STORAGE_PROVIDER").toLowerCase();

  if (providerRaw !== "s3" && providerRaw !== "r2") {
    throw new Error("STORAGE_PROVIDER must be either 's3' or 'r2'");
  }

  const provider = providerRaw as StorageProvider;
  const endpoint = env.STORAGE_ENDPOINT?.trim() || undefined;

  if (provider === "r2" && !endpoint) {
    throw new Error("STORAGE_ENDPOINT is required when STORAGE_PROVIDER is 'r2'");
  }

  return {
    provider,
    bucket: requireEnv(env, "STORAGE_BUCKET"),
    region: requireEnv(env, "STORAGE_REGION"),
    endpoint,
    forcePathStyle: parseBoolean(
      env.STORAGE_FORCE_PATH_STYLE,
      provider === "r2"
    ),
    accessKeyId: requireEnv(env, "STORAGE_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv(env, "STORAGE_SECRET_ACCESS_KEY"),
    uploadPrefix: env.LICENSE_UPLOAD_PREFIX?.trim() || "licenses",
    maxUploadBytes: parsePositiveInt(
      env.LICENSE_UPLOAD_MAX_BYTES,
      5 * 1024 * 1024,
      "LICENSE_UPLOAD_MAX_BYTES"
    ),
    allowedMimeTypes: parseMimeList(env.LICENSE_UPLOAD_ALLOWED_MIME),
    uploadPresignTtlSeconds: parsePositiveInt(
      env.LICENSE_UPLOAD_PRESIGN_TTL_SECONDS,
      300,
      "LICENSE_UPLOAD_PRESIGN_TTL_SECONDS"
    ),
    downloadPresignTtlSeconds: parsePositiveInt(
      env.LICENSE_DOWNLOAD_PRESIGN_TTL_SECONDS,
      120,
      "LICENSE_DOWNLOAD_PRESIGN_TTL_SECONDS"
    ),
  };
}
