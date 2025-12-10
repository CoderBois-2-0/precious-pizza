import { createRouter } from "$routers/util";
import { injectOrderHandler, IOrderEnv } from "./middleware";
import { orderBasketParamValidator, orderParamValidator, orderPostValidator } from "./validation";

const router = createRouter<IOrderEnv>()
  .use(injectOrderHandler)
  // Create order from a basket
  .post("/", orderPostValidator, async (c) => {
    const orderHandler = c.get("orderHandler");
    const body = c.req.valid("json");

    try {
      const order = await orderHandler.createOrder(body);
      return c.json(order, 201);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not create order" }, 500);
    }
  })
  // Get a full order by ID
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
  })
  // Get an order for a basket
  .get("/basket/:basketID", orderBasketParamValidator, async (c) => {
    const orderHandler = c.get("orderHandler");
    const { basketID } = c.req.valid("param");

    try {
      const orders = await orderHandler.getByBasket(basketID);
      return c.json(orders);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch orders for basket" }, 500);
    }
  });

export default router;
