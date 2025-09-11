import { panelRoutes, publicRoutes } from "@/routes/route"
import { getToken, JWT } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { Middleware, MiddlewareResponse } from "."

export type AuthMiddleware = (req: NextRequest, token: JWT) => MiddlewareResponse

export const authChain = (middlewares: AuthMiddleware[]): Middleware => {
  return async (req: NextRequest) => {
    const { pathname } = req.nextUrl

    if (pathname.startsWith(panelRoutes.home)) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

      if (!token) {
        return NextResponse.redirect(new URL(publicRoutes.login, req.url))
      }

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

export const redirectPanel: Middleware = async (req: NextRequest): Promise<NextResponse> => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith(publicRoutes.login)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (token) {
      return NextResponse.redirect(new URL(panelRoutes.home, req.url))
    }
  }
  
  return NextResponse.next()
}