import { createMiddleware } from "hono/factory";
import { OrderHandler } from "$db/order/handler";
import { IEnv } from "$routers/types";
import { IOrderVariables } from ".";
import { getDB } from "$db/index";

interface IOrderEnv extends IEnv {
  Variables: IOrderVariables;
}

const injectOrderHandler = createMiddleware<IOrderEnv>((c, next) => {
  const db = getDB(c.env.DB_URL, c.env.ENVIRONMENT !== "production");

  const orderHandler = new OrderHandler(db);

  c.set("orderHandler", orderHandler);
  return next();
});

export { injectOrderHandler, IOrderEnv };
