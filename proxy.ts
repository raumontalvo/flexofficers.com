import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPrivatePage = createRouteMatcher([
  "/dashboard(.*)",
  "/company(.*)",
  "/officer(.*)",
  "/admin(.*)",
  "/shifts/create(.*)",
]);

const isPrivateApi = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivatePage(req) || isPrivateApi(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};