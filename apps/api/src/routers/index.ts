import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";
import { createRouter } from "./util";
import { csrf } from "hono/csrf";
import { basketRouter } from "./basket";

interface IEnv {
  Bindings: CloudflareBindings;
}

const app = createRouter()
  .use((c, next) => {
    const corsMiddelware = cors({
      origin: c.env.CORS_ORIGIN,
      credentials: true,
    });

    return corsMiddelware(c, next);
  })
  .use(csrf())
  .use(secureHeaders())
  .route("/", publicRouter)
  .route("/", protectedRouter);
  // .route("/basket", basketRouter);

export default app;
