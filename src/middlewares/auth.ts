import { panelRoutes, publicRoutes } from "@/routes/route"
import { getToken, JWT } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { Middleware, MiddlewareResponse } from "."

export type AuthMiddleware = (req: NextRequest, token: JWT) => MiddlewareResponse

export const authChain = (middlewares: AuthMiddleware[]): Middleware => {
  return async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = req.nextUrl

    if (!token) {
      return NextResponse.redirect(new URL(publicRoutes.login, req.url))
    }

    if (pathname.startsWith(panelRoutes.home)) {
      for (const mw of middlewares) {
        const result = mw(req, token)
        const resolved = result instanceof Promise ? await result : result
        const isResponseNext = resolved?.headers.get("x-middleware-next") === "1"
        if (resolved && !isResponseNext) {
          return resolved
        }
      } 
    }

    return NextResponse.next()
  }
}
