import {NextResponse} from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/dashboard", "/expenses"];

export function middleware(request) {
  const {pathname} = request.nextUrl;
  // Only protect exact matches and subroutes
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("access");
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*"],
};
