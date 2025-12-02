import { Context } from "hono";
import { JwtVariables } from "hono/jwt";

import { TSafeUser } from "$db/user/types";

interface IEnv {
  Bindings: CloudflareBindings;
}

type TContext<TEnv extends IEnv = IEnv> = Context<TEnv>;

type TProtectedVariables = JwtVariables<TSafeUser>;

interface IProtectedEnv extends IEnv {
  Variables: TProtectedVariables;
}
export { IEnv, TContext, IProtectedEnv, TProtectedVariables };
