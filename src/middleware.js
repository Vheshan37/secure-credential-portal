import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/login") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
