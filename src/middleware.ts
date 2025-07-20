import NextAuth from "next-auth";
import authConfig from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const protectedPath = req.nextUrl.pathname.startsWith("/dashboard");
  const loginPath = req.nextUrl.pathname.startsWith("/login");

  if (loginPath && session?.user) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (protectedPath && !session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
