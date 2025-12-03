import UserHandler from "$db/user/handler";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";

interface IAuthVariables {
  userHandler: UserHandler;
}

export const authRouter = {
  path: "/auth" as const,
  publicRouter,
  protectedRouter,
};
export { IAuthVariables };
