import { Hono } from "hono";
import { cors } from "hono/cors";

interface IEnv {
  Bindings: CloudflareBindings;
}

function createRouter<TEnv extends IEnv = IEnv>() {
  return new Hono<TEnv>();
}

const app = createRouter().use((c, next) => {
  const corsMiddelware = cors({
    origin: c.env.CORS_ORIGIN,
  });

  return corsMiddelware(c, next);
});

export default app;
export { createRouter };
