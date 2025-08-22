import { NextRequest, NextResponse } from "next/server"

export type MiddlewareResponse = Promise<NextResponse> | NextResponse | void
export type Middleware = (req: NextRequest) => MiddlewareResponse

export function chain(middlewares: Middleware[]): Middleware {
  return async (req: NextRequest) => {
    for (const mw of middlewares) {
      const result = mw(req)

      // If result is a Promise → await it
      const resolved = result instanceof Promise ? await result : result

      // If middleware already returned a response (redirect, rewrite, etc.)
      const isResponseNext = resolved?.headers.get("x-middleware-next") === "1"
      if (resolved && !isResponseNext) {
        return resolved
      }
    }

    return NextResponse.next()
  }
}