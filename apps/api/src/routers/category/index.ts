import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";

export const categoryRouter = {
  path: "/category",
  publicRouter,
  protectedRouter,
};
