import { createRouter } from "$routers/util";
import { IProtectedEnv, TProtectedVariables } from "$routers/types";
import { removeAuthCookie } from "$routers/util";
import { IAuthVariables } from "./index";

interface IAuthProtectedVariables extends TProtectedVariables, IAuthVariables {}

interface IAuthProtectedEnv extends Omit<IProtectedEnv, "Variables"> {
  Variables: IAuthProtectedVariables;
}

const router = createRouter<IAuthProtectedEnv>()
  .get("sign-out", (c) => {
    removeAuthCookie(c);

    return c.json({ message: "User signed out" }, 200);
  })
  .get("/is-authenticated", (c) => {
    const jwtPayload = c.get("jwtPayload");

    // if the request gets to this callback, then the user is authenticated, jwt middleware handles the security in the protected router
    return c.json(jwtPayload, 200);
  });

export default router;
