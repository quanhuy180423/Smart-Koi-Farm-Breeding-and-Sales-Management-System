import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define user roles
export enum UserRole {
  MANAGER = "manager",
  FARM_STAFF = "farm-staff",
  SALE_STAFF = "sale-staff",
  CUSTOMER = "customer",
  GUEST = "guest",
}

// Define route protection rules (only protected routes are listed)
const routeProtection: Record<string, UserRole[]> = {
  "/manager": [UserRole.MANAGER, UserRole.FARM_STAFF],
  "/sale": [UserRole.SALE_STAFF],
  // add other protected routes here as needed
};

// Auth routes (login, register, etc.)
const authRoutes = [
  "/login",
  "/register",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Get user role from cookies (client writes `user-role` cookie)
  const userRole =
    (request.cookies.get("user-role")?.value as UserRole) || UserRole.GUEST;
  const isAuthenticated = userRole !== UserRole.GUEST;

  // Check if current route is auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Handle authentication logic
  if (isAuthRoute) {
    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      const redirectUrl = getDashboardUrl(userRole);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // Allow guests to access auth pages
    return NextResponse.next();
  }

  // Check route protection
  for (const [route, allowedRoles] of Object.entries(routeProtection)) {
    if (pathname.startsWith(route)) {
      // If user is not authenticated, redirect to login
      if (!isAuthenticated) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        return NextResponse.redirect(new URL(loginUrl, request.url));
      }

      // Check if user has required role
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on user role
        const redirectUrl = getDashboardUrl(userRole);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // User has access, continue
      return NextResponse.next();
    }
  }

  // For public routes or other routes, allow access
  return NextResponse.next();
}

// Helper function to get dashboard URL based on user role
function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case UserRole.MANAGER:
      return "/manager";
    case UserRole.SALE_STAFF:
      return "/sale";
    case UserRole.CUSTOMER:
      return "/";
    default:
      return "/";
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
