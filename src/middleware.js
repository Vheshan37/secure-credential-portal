import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/guestLogin") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    if (pathname.startsWith("/api/")) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/user") && user.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/user/:path*", "/api/user/:path*","/api/user/request/:path*"],
};
