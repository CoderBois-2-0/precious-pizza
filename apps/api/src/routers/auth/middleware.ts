import { createMiddleware } from "hono/factory";
import UserHandler from "$db/user/handler";
import { IEnv } from "$routers/types";
import { IAuthVariables } from "./index";

interface IAuthEnv extends IEnv {
  Variables: IAuthVariables;
}

const injectUserHandler = createMiddleware<IAuthEnv>((c, next) => {
  const userHandler = new UserHandler(c.env.DB_URL);
  c.set("userHandler", userHandler);

  return next();
});

export { injectUserHandler };
