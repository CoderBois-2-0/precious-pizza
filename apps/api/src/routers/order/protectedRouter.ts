import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { IOrderVariables } from ".";
import { injectOrderHandler } from "./middleware";
import { orderParamValidator } from "./validation";

interface IProtectedOrderVariables
  extends IOrderVariables,
    TProtectedVariables {}

interface IProtectedOrderEnv extends IEnv {
  Variables: IProtectedOrderVariables;
}

const router = createRouter<IProtectedOrderEnv>()
  .use(requireAdmin)
  .use(injectOrderHandler)
  // Admin: get a full order by ID
  .get("/:id", orderParamValidator, async (c) => {
    const orderHandler = c.get("orderHandler");
    const { id } = c.req.valid("param");

    try {
      const order = await orderHandler.getFullOrder(id);
      if (!order) return c.json({ message: "Order not found" }, 404);
      return c.json(order);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch order" }, 500);
    }
  });

export default router;
