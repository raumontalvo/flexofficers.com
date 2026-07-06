import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { resolveRobotsTagHeader } from "@/lib/seo-robots";

const isPublicApi = createRouteMatcher(["/api/stripe/webhook"]);

const isClientPublicPage = createRouteMatcher([
  "/client/sign-in(.*)",
  "/client/sign-up(.*)",
]);

const isPrivatePage = createRouteMatcher([
  "/dashboard(.*)",
  "/company(.*)",
  "/officer(.*)",
  "/client(.*)",
  "/admin(.*)",
  "/shifts/create(.*)",
]);

const isPrivateApi = createRouteMatcher(["/api(.*)"]);

function withRobotsTag(response: NextResponse, req: NextRequest) {
  const isPrivateRoute =
    isPrivatePage(req) ||
    isPrivateApi(req) ||
    (req.nextUrl.pathname.startsWith("/client") && isClientPublicPage(req));

  response.headers.set(
    "X-Robots-Tag",
    resolveRobotsTagHeader(isPrivateRoute)
  );

  return response;
}

function continueWithPathname(req: NextRequest, requestHeaders: Headers) {
  return withRobotsTag(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
    req
  );
}

export default clerkMiddleware(async (auth, req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  if (isPublicApi(req)) {
    return continueWithPathname(req, requestHeaders);
  }

  if (isPrivatePage(req) || isPrivateApi(req)) {
    if (req.nextUrl.pathname.startsWith("/client") && isClientPublicPage(req)) {
      return continueWithPathname(req, requestHeaders);
    }

    await auth.protect();
  }

  return continueWithPathname(req, requestHeaders);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};