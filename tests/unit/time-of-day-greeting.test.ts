import { describe, expect, it } from "vitest";
import { getTimeOfDayGreeting } from "@/lib/time-of-day-greeting";

describe("getTimeOfDayGreeting", () => {
  it("returns Good Morning before noon", () => {
    expect(getTimeOfDayGreeting(new Date("2026-06-26T08:00:00"))).toBe(
      "Good Morning,"
    );
  });

  it("returns Good Afternoon between noon and 5pm", () => {
    expect(getTimeOfDayGreeting(new Date("2026-06-26T13:00:00"))).toBe(
      "Good Afternoon,"
    );
  });

  it("returns Good Evening after 5pm", () => {
    expect(getTimeOfDayGreeting(new Date("2026-06-26T18:00:00"))).toBe(
      "Good Evening,"
    );
  });
});
