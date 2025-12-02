import publicRouter from "./publicRouter";
import protectedRouter from "./publicRouter";

export default {
  path: "auth/" as const,
  publicRouter,
  protectedRouter,
};
