import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "./lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"],
};

export async function middleware(request) {
  const protectedRoutes = ["/"]; // add other protected routes

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route + "/")
  );

  if (isProtectedRoute) {
    const token = (await cookies()).get("token")?.value;
    const user = token ? await verifyAuth(token) : null;

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
