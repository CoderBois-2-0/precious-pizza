import { jwt, sign, JwtVariables } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";

import { TSafeUser } from "$db/user/types";
import { createRouter, TContext } from "./index";
import authRouter from "./auth/index";

interface IProtectedEnv {
  Variables: JwtVariables<TSafeUser>;
}

const authTokenName = "auth-name";

/**
 * @description
 * setAuthCookie will set the jwt cookie
 */
async function setAuthCookie(c: TContext, payload: TSafeUser) {
  const jwtValue = await sign(payload, c.env.JWT_SECRET);

  setCookie(c, authTokenName, jwtValue, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 3,
    secure: Boolean(c.env.PROD),
  });
}

function removeAuthCookie(c: TContext) {
  deleteCookie(c, authTokenName);
}

const router = createRouter()
  .use((c, next) => {
    const jwtHandler = jwt({
      secret: c.env.JWT_SECRET,
      cookie: authTokenName,
    });

    return jwtHandler(c, next);
  })
  .route(authRouter.path, authRouter.protectedRouter);

export default router;
export { IProtectedEnv, setAuthCookie, removeAuthCookie };
