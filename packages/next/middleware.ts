import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isSignInRoute = createRouteMatcher(["/login"]);
const isStripeWebhookRoute = createRouteMatcher(["/api/webhooks/stripe"]);
const isSSOCallbackRoute = createRouteMatcher(["/sso-callback"]);

export default clerkMiddleware((auth, req) => {
  if (isStripeWebhookRoute(req)) {
    // Allow requests to the Stripe webhook route to go through
    return NextResponse.next();
  }

  if (!auth().userId && !isSignInRoute(req) && !isSSOCallbackRoute(req)) {
    // Redirect non-authenticated users to the signin page unless they are already there or on the SSO callback route
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (auth().userId && isSignInRoute(req)) {
    // Redirect authenticated users away from the signin page to the dashboard
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
