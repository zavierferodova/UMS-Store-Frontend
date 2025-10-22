import { panelRoutes, publicRoutes } from '@/routes/route';
import { AuthMiddleware } from './auth';
import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const panelUsersMiddleware: AuthMiddleware = (req: NextRequest, token: JWT) => {
  const { pathname } = req.nextUrl;

  if (token.user.role === 'procurement') {
    if (pathname.startsWith(panelRoutes.users)) {
      return NextResponse.redirect(new URL(publicRoutes.notFound, req.url));
    }
  }

  return NextResponse.next();
};
