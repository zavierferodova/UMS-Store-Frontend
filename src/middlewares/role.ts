import { panelRoutes } from '@/routes/route';
import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from './auth';

export const roleMiddleware: AuthMiddleware = (req: NextRequest, token: JWT) => {
  const { pathname } = req.nextUrl;

  if (token?.user?.role) {
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
};
