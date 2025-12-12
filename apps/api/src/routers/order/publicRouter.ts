import { createRouter, authTokenName } from "$routers/util";
import { injectOrderHandler, IOrderEnv } from "./middleware";
import {
  orderBasketParamValidator,
  orderParamValidator,
  orderPostValidator,
} from "./validation";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";

const router = createRouter<IOrderEnv>()
  .use(injectOrderHandler)
  // Create order from a basket
  .post("/", orderPostValidator, async (c) => {
    const orderHandler = c.get("orderHandler");
    const body = c.req.valid("json");

    // Optionally attach authenticated user
    const token = getCookie(c, authTokenName);
    let userID: string | undefined;
    if (token) {
      try {
        const payload = await verify(token, c.env.JWT_SECRET);
        userID = (payload as any).id;
      } catch (_) {
        // ignore invalid tokens to keep public checkout working
      }
    }

    try {
      const order = await orderHandler.createOrder({ ...body, userID });
      return c.json(order, 201);
    } catch (e) {
      console.error("Order creation failed:", e);
      const message = e instanceof Error ? e.message : "Could not create order";
      return c.json({ message }, 500);
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
