import { NextResponse } from "next/server";

export type RateLimitProfile = "strict" | "moderate";

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type EnforceRateLimitInput = {
  request: Request;
  bucket: string;
  profile: RateLimitProfile;
  clerkUserId?: string;
};

export const RATE_LIMIT_CONFIGS: Record<RateLimitProfile, RateLimitConfig> = {
  strict: {
    windowMs: 60_000,
    maxRequests: 20,
  },
  moderate: {
    windowMs: 60_000,
    maxRequests: 60,
  },
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");

  if (cfIp) {
    return cfIp.trim();
  }

  return null;
}

function getRequesterKey(request: Request, clerkUserId?: string) {
  if (clerkUserId && clerkUserId.trim()) {
    return `user:${clerkUserId.trim()}`;
  }

  const clientIp = getClientIp(request);

  if (clientIp) {
    return `ip:${clientIp}`;
  }

  return "ip:unknown";
}

function sweepExpiredEntries(now: number) {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function enforceRateLimit({
  request,
  bucket,
  profile,
  clerkUserId,
}: EnforceRateLimitInput) {
  const config = RATE_LIMIT_CONFIGS[profile];
  const now = Date.now();

  if (rateLimitStore.size > 5_000) {
    sweepExpiredEntries(now);
  }

  const requesterKey = getRequesterKey(request, clerkUserId);
  const key = `${bucket}:${requesterKey}`;
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return null;
  }

  if (existing.count >= config.maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    return NextResponse.json(
      {
        error: "Too many requests",
        retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return null;
}
