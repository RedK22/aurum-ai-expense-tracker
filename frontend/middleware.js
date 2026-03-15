import {NextResponse} from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("access");

  const protectedRoutes = [
    "/dashboard",
    "/expenses",
    "/categories",
    "/subscriptions",
    "/chat",
  ];

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/categories/:path*",
    "/subscriptions/:path*",
    "/chat/:path*",
  ],
};
