import { createMiddleware } from "hono/factory";
import PizzaHandler from "$db/pizza/handler";
import { IPizzaEnv } from "./publicRouter";

const injectPizzaHandler = createMiddleware<IPizzaEnv>((c, next) => {
  const pizzaHandler = new PizzaHandler(
    c.env.DB_URL,
    c.env.ENVIRONMENT !== "production",
  );
  c.set("pizzaHandler", pizzaHandler);

  return next();
});

export { injectPizzaHandler };
