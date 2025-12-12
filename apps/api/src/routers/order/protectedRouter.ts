import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { IOrderVariables } from ".";
import { injectOrderHandler } from "./middleware";

interface IProtectedOrderVariables
  extends IOrderVariables,
    TProtectedVariables {}

interface IProtectedOrderEnv extends IEnv {
  Variables: IProtectedOrderVariables;
}

const router = createRouter<IProtectedOrderEnv>()
  .use(requireAdmin)
  .use(injectOrderHandler)
  // Admin: get orders by user ID
  .get("/user/:userID", async (c) => {
    const orderHandler = c.get("orderHandler");
    const { userID } = c.req.param();

    try {
      const orders = await orderHandler.getByUser(userID);
      return c.json(orders);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch orders for user" }, 500);
    }
  });

export default router;
