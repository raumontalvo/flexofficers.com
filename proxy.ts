import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  "/onboarding(.*)",
]);

const isPrivateApi = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  if (isPublicApi(req)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isPrivatePage(req) || isPrivateApi(req)) {
    if (req.nextUrl.pathname.startsWith("/client") && isClientPublicPage(req)) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    await auth.protect();
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};