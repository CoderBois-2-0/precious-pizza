import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";

interface IEnv {
  Bindings: CloudflareBindings;
}

type TContext<TEnv extends IEnv = IEnv> = Context<TEnv>;

function createRouter<TEnv extends IEnv = IEnv>() {
  return new Hono<TEnv>();
}

const app = createRouter()
  .use((c, next) => {
    const corsMiddelware = cors({
      origin: c.env.CORS_ORIGIN,
    });

    return corsMiddelware(c, next);
  })
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default app;
export { createRouter, IEnv, TContext };
