import { createMiddleware } from "hono/factory";
import { BasketHandler } from "$db/basket/handler";
import { IBasketEnv } from "./publicRouter";
import { getDB } from "$db/index";

const injectBasketHandler = createMiddleware<IBasketEnv>((c, next) => {
  const db = getDB(c.env.DB_URL, c.env.ENVIRONMENT !== "production");
  const basketHandler = new BasketHandler(db);
  c.set("basketHandler", basketHandler);

  return next();
});

export { injectBasketHandler };
