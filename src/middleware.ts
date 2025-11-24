import { chain } from './middlewares';
import { authChain } from './middlewares/auth';
import { roleMiddleware } from './middlewares/role';
import { panelUsersMiddleware } from './middlewares/panel';
import { redirectPanel } from './middlewares/auth';
import { userProfileMiddleware } from './middlewares/user';

const authMiddlewares = authChain([roleMiddleware, panelUsersMiddleware, userProfileMiddleware]);
export const middleware = chain([redirectPanel, authMiddlewares]);

export const config = { matcher: ['/panel/:path*', '/no-role', '/login', '/panel/users/:path*'] };
