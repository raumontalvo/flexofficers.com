import { describe, expect, it } from "vitest";
import { UserRole } from "@/app/generated/prisma/enums";
import { getRequiredApiRole } from "@/lib/api-rbac-paths";
import {
  getRequiredRoleForPath,
  getRoleHomePath,
  isClientPublicPath,
  isPathAllowedForRole,
  parseClerkMetadataRole,
} from "@/lib/rbac-paths";

describe("page RBAC helpers", () => {
  it("maps each role to its home path", () => {
    expect(getRoleHomePath(UserRole.ADMIN)).toBe("/admin");
    expect(getRoleHomePath(UserRole.CLIENT)).toBe("/client");
    expect(getRoleHomePath(UserRole.COMPANY)).toBe("/company");
    expect(getRoleHomePath(UserRole.OFFICER)).toBe("/officer");
  });

  it("treats client sign-in and sign-up as public client paths", () => {
    expect(isClientPublicPath("/client/sign-in")).toBe(true);
    expect(isClientPublicPath("/client/sign-up")).toBe(true);
    expect(isClientPublicPath("/client")).toBe(false);
  });

  it("requires the correct role for protected prefixes", () => {
    expect(getRequiredRoleForPath("/client/leads")).toBe(UserRole.CLIENT);
    expect(getRequiredRoleForPath("/company/leads")).toBe(UserRole.COMPANY);
    expect(getRequiredRoleForPath("/officer/settings")).toBe(UserRole.OFFICER);
    expect(getRequiredRoleForPath("/admin/companies")).toBe(UserRole.ADMIN);
    expect(getRequiredRoleForPath("/shifts/create")).toBe(UserRole.COMPANY);
    expect(getRequiredRoleForPath("/dashboard")).toBeNull();
  });

  it("allows only client routes for client users", () => {
    expect(isPathAllowedForRole(UserRole.CLIENT, "/client")).toBe(true);
    expect(isPathAllowedForRole(UserRole.CLIENT, "/client/leads")).toBe(true);
    expect(isPathAllowedForRole(UserRole.CLIENT, "/client/sign-in")).toBe(false);
    expect(isPathAllowedForRole(UserRole.CLIENT, "/company/leads")).toBe(false);
    expect(isPathAllowedForRole(UserRole.CLIENT, "/dashboard")).toBe(false);
  });

  it("allows only company routes for company users", () => {
    expect(isPathAllowedForRole(UserRole.COMPANY, "/company/leads")).toBe(true);
    expect(isPathAllowedForRole(UserRole.COMPANY, "/dashboard")).toBe(true);
    expect(isPathAllowedForRole(UserRole.COMPANY, "/shifts/create")).toBe(true);
    expect(isPathAllowedForRole(UserRole.COMPANY, "/client")).toBe(false);
    expect(isPathAllowedForRole(UserRole.COMPANY, "/officer/profile")).toBe(false);
  });

  it("allows only officer routes for officer users", () => {
    expect(isPathAllowedForRole(UserRole.OFFICER, "/officer/profile")).toBe(true);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/dashboard")).toBe(true);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/shifts")).toBe(true);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/shifts/abc")).toBe(true);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/shifts/create")).toBe(false);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/client")).toBe(false);
    expect(isPathAllowedForRole(UserRole.OFFICER, "/company/leads")).toBe(false);
  });

  it("redirects wrong-role users to their own home area", () => {
    expect(getRoleHomePath(UserRole.COMPANY)).toBe("/company");
    expect(getRoleHomePath(UserRole.CLIENT)).toBe("/client");
    expect(getRoleHomePath(UserRole.OFFICER)).toBe("/officer");
  });
});

describe("API RBAC helpers", () => {
  it("maps API prefixes to roles", () => {
    expect(getRequiredApiRole("/api/client/leads")).toBe(UserRole.CLIENT);
    expect(getRequiredApiRole("/api/company/staff")).toBe(UserRole.COMPANY);
    expect(getRequiredApiRole("/api/officer/profile")).toBe(UserRole.OFFICER);
    expect(getRequiredApiRole("/api/admin/companies/123/access-status")).toBe(
      UserRole.ADMIN
    );
    expect(getRequiredApiRole("/api/contact")).toBeNull();
  });
});

describe("Clerk metadata role parsing", () => {
  it("accepts valid Clerk metadata roles", () => {
    expect(parseClerkMetadataRole(UserRole.COMPANY)).toBe(UserRole.COMPANY);
    expect(parseClerkMetadataRole("INVALID")).toBeNull();
  });

  it("prefers Prisma role over Clerk metadata when both exist", () => {
    expect(getRoleHomePath(UserRole.COMPANY)).toBe("/company");
    expect(getRoleHomePath(UserRole.CLIENT)).toBe("/client");
  });
});
