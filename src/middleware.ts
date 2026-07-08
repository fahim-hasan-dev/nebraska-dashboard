import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that are used for authentication
const AUTH_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/otp-verify",
];

// Define routes that are completely public
const PUBLIC_ROUTES = [
  "/privacy-policy",
  "/terms-and-conditions",
  "/delete-user-account",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. If the path is a public route, allow access
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // 1. Retrieve the accessToken from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  // 2. If the user is trying to access an authentication page
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // If they already have an access token, redirect them to the dashboard home
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, let them proceed to the auth page
    return NextResponse.next();
  }

  // 3. For any other route (dashboard pages), if there is no token, redirect to login
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If token is present, allow access
  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
