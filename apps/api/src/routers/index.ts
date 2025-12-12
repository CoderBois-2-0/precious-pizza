import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";
import { createRouter } from "./util";
import { csrf } from "hono/csrf";

const app = createRouter()
  .use((c, next) => {
    const corsMiddelware = cors({
      origin: c.env.CORS_ORIGIN,
      credentials: true,
    });

    return corsMiddelware(c, next);
  })
  .use((c, next) => {
    const csrfMiddleware = csrf({
      origin: c.env.CORS_ORIGIN,
    });
    return csrfMiddleware(c, next);
  })
  .use(secureHeaders())
  .route("/", publicRouter)
  .route("/", protectedRouter);

export default app;
