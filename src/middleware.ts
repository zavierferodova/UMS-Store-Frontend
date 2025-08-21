import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { panelRoutes } from "./routes/route";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;

  if (token.user?.role) {
    if (pathname.startsWith(panelRoutes.home)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(panelRoutes.home, req.url));
  } else {
    if (pathname.startsWith(panelRoutes.noRole)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(panelRoutes.noRole, req.url));
  }
}

export const config = { matcher: ["/panel/:path*", "/no-role"] };
