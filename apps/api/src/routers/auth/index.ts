import UserHandler from "$db/user/handler";
import publicRouter from "./publicRouter";
import protectedRouter from "./publicRouter";

interface IAuthVariables {
  userHandler: UserHandler;
}

export const authRouter = {
  path: "/auth" as const,
  publicRouter,
  protectedRouter,
};
export { IAuthVariables };
