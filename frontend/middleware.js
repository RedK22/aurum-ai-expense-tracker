import {NextResponse} from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("access")?.value;

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/expenses",
    "/categories",
    "/subscriptions",
    "/chat",
  ];

  const authRoutes = ["/", "/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // ❌ Not logged in → block protected routes
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in → block auth pages
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/expenses/:path*",
    "/categories/:path*",
    "/subscriptions/:path*",
    "/chat/:path*",
  ],
};
