import { describe, expect, it } from "vitest";
import { parseApiJsonResponse } from "@/lib/parse-api-response";

describe("parseApiJsonResponse", () => {
  it("returns null for empty response bodies", async () => {
    const response = new Response("", { status: 500 });

    await expect(parseApiJsonResponse(response)).resolves.toBeNull();
  });

  it("parses JSON when a body is present", async () => {
    const response = new Response(JSON.stringify({ error: "Stripe billing is not configured." }), {
      status: 503,
    });

    await expect(parseApiJsonResponse(response)).resolves.toEqual({
      error: "Stripe billing is not configured.",
    });
  });

  it("throws for invalid JSON bodies", async () => {
    const response = new Response("not-json", { status: 500 });

    await expect(parseApiJsonResponse(response)).rejects.toThrow(
      "Invalid response from server."
    );
  });
});
