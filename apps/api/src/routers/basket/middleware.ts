import { createMiddleware } from "hono/factory";
import { BasketHandler } from "$db/basket/handler";
import { IBasketEnv } from "./publicRouter";

const injectBasketHandler = createMiddleware<IBasketEnv>((c, next) => {
  const basketHandler = new BasketHandler(
    c.env.DB_URL,
    c.env.ENVIRONMENT !== "production",
  );
  c.set("basketHandler", basketHandler);

  return next();
});

export { injectBasketHandler };
