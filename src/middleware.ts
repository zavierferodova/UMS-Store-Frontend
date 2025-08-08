import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;

  if (token.user.role) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  } else {
    if (pathname.startsWith("/no-role")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/no-role", req.url));
  }
}

export const config = { matcher: ["/admin/:path*", "/no-role"] };
