import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from './auth';
import { panelRoutes } from '@/routes/route';

export const userProfileMiddleware: AuthMiddleware = (req: NextRequest, token: JWT) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(panelRoutes.users)) {
    const pathId = pathname.split(panelRoutes.users)[1].split('/')[0];
    if (token?.user?.id === pathId) {
      return NextResponse.redirect(new URL(panelRoutes.profile, req.url));
    }
  }

  return NextResponse.next();
};
