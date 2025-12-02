import { cors } from "hono/cors";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";
import { createRouter } from "./util";

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
