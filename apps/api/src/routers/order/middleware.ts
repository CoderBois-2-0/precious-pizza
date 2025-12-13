import { createMiddleware } from "hono/factory";
import { OrderHandler } from "$db/order/handler";
import { IEnv } from "$routers/types";
import { IOrderVariables } from ".";

interface IOrderEnv extends IEnv {
  Variables: IOrderVariables;
}

const injectOrderHandler = createMiddleware<IOrderEnv>((c, next) => {
  const orderHandler = new OrderHandler(
    c.env.DB_URL,
    c.env.ENVIRONMENT !== "production",
  );
  c.set("orderHandler", orderHandler);
  return next();
});

export { injectOrderHandler, IOrderEnv };
