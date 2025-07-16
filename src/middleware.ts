import NextAuth from "next-auth";
import authConfig from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const protectedPath = req.nextUrl.pathname.startsWith("/dashboard");

  if (protectedPath && !session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
