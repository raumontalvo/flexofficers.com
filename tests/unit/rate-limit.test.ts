import { describe, expect, it } from "vitest";
import { enforceRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

describe("enforceRateLimit", () => {
  it("returns 429 with Retry-After when request count exceeds limit", async () => {
    const request = new Request("http://localhost/api/test", {
      headers: {
        "x-forwarded-for": "203.0.113.10",
      },
    });

    const bucket = `rate-limit-${Date.now()}-${Math.random()}`;

    for (let i = 0; i < RATE_LIMIT_CONFIGS.strict.maxRequests; i += 1) {
      const response = enforceRateLimit({
        request,
        bucket,
        profile: "strict",
        clerkUserId: "user_123",
      });

      expect(response).toBeNull();
    }

    const blocked = enforceRateLimit({
      request,
      bucket,
      profile: "strict",
      clerkUserId: "user_123",
    });

    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get("Retry-After")).toBeTruthy();

    const body = await blocked?.json();
    expect(body.error).toBe("Too many requests");
    expect(typeof body.retryAfterSeconds).toBe("number");
    expect(body.retryAfterSeconds).toBeGreaterThan(0);
  });
});
