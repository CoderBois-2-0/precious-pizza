import { IEnv } from "$routers/types";
import { createRouter } from "$routers/util";
import { IBasketVariables } from ".";
import { injectBasketHandler } from "./middleware";

interface IBasketEnv extends IEnv {
  Variables: IBasketVariables;
}

const router = createRouter<IBasketEnv>()
  .use(injectBasketHandler)
  .get("/:basketID", basketQueryValidator, async (c) => {
    const basketHandler = c.get("basketHandler");
    const query = c.req.valid("query")

    try {
        const basket
        
    } catch (error) {
        
    }
  });

export { IBasketEnv };

const basketRouters = createRouter()
  // Get all items in a basket
  .get("/:basketID", async (c) => {
    try {
      const { basketID } = c.req.param();
      const handler = new BasketHandler(process.env.DB_URL!);
      const items: IBasketItemQuery[] = await handler.getBasketItems(basketID);

      return c.json({ basketID, items });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to fetch basket" }, 500);
    }
  })

  // Get full basket (items + totalPrice + createdAt)
  .get("/full/:basketID", async (c) => {
    try {
      const { basketID } = c.req.param();
      const handler = new BasketHandler(process.env.DB_URL!);
      const fullBasket: IBasketQuery = await handler.getFullBasket(basketID);

      return c.json(fullBasket);
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to fetch full basket" }, 500);
    }
  })

  // Create a new empty basket
  .post("/", async (c) => {
    try {
      const handler = new BasketHandler(process.env.DB_URL!);
      const basketID: string = await handler.createBasket();

      return c.json({ id: basketID });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to create basket" }, 500);
    }
  })

  // Add a pizza to the basket
  .post("/:basketID/add", async (c) => {
    try {
      const { basketID } = c.req.param();
      const body: IBasketItemInsert = await c.req.json();
      const handler = new BasketHandler(process.env.DB_URL!);

      await handler.addPizzaToBasket({
        ...body,
        basketID,
      });

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to add pizza to basket" }, 500);
    }
  })

  // Remove a pizza from the basket
  .delete("/:basketID/item/:itemID", async (c) => {
    try {
      const { basketID, itemID } = c.req.param();
      const handler = new BasketHandler(process.env.DB_URL!);

      await handler.removePizzaFromBasket(basketID, Number(itemID));

      return c.json({ success: true });
    } catch (error) {
      console.error(error);
      return c.json({ error: "Failed to remove pizza from basket" }, 500);
    }
  });

export { basketRouters };