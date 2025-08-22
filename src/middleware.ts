import { chain } from "./middlewares"
import { authChain } from "./middlewares/auth"
import { roleMiddleware } from "./middlewares/role"
import { panelUsersMiddleware } from "./middlewares/panel"

const authMiddlewares = [authChain([roleMiddleware, panelUsersMiddleware])]
export const middleware = chain(authMiddlewares)

export const config = { matcher: ["/panel/:path*", "/no-role"] }
