import type { Metadata } from "next";

export function isProductionDeployment(): boolean {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export const indexableRobotsMetadata: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
};

export const noIndexRobotsMetadata: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export function resolveRobotsTagHeader(isPrivateRoute: boolean): string {
  if (!isProductionDeployment()) {
    return "noindex, nofollow";
  }

  if (isPrivateRoute) {
    return "noindex, nofollow";
  }

  return "index, follow";
}
