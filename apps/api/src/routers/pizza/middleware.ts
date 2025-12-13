import { createMiddleware } from "hono/factory";
import PizzaHandler from "$db/pizza/handler";
import { IPizzaEnv } from "./publicRouter";
import { getDB } from "$db/index"; // import getDB here

const injectPizzaHandler = createMiddleware<IPizzaEnv>((c, next) => {
  // Create DB client once
  const db = getDB(c.env.DB_URL, c.env.ENVIRONMENT !== "production");

  // Pass DB to handler
  const pizzaHandler = new PizzaHandler(db);

  c.set("pizzaHandler", pizzaHandler);

  return next();
});

export { injectPizzaHandler };
