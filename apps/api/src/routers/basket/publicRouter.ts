import { IEnv } from "$routers/types";
import { createRouter } from "$routers/util";
import { IBasketVariables } from ".";
import { injectBasketHandler } from "./middleware";
import { basketAddItemValidator, basketItemParamValidator, basketParamValidator, basketPostValidator } from "./validation";

interface IBasketEnv extends IEnv {
  Variables: IBasketVariables;
}

const router = createRouter<IBasketEnv>()
  .use(injectBasketHandler)
  // Get all items in a basket
  .get("/:id", basketParamValidator, async (c) => {
    const basketHandler = c.get("basketHandler");
    const { id: basketID } = c.req.valid("param");

    try {
      const items = await basketHandler.getBasketItems(basketID);
      return c.json(items);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch basket items" }, 500);
    }
  })
  // Get full basket (items + totalPrice + createdAt)
  .get("/full/:id", basketParamValidator, async (c) => {
    const basketHandler = c.get("basketHandler");
    const { id: basketID } = c.req.valid("param");

    try {
      const basket = await basketHandler.getFullBasket(basketID);
      return c.json(basket);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch basket with details" }, 500);
    }
  })
  // Create a new empty basket
  .post("/", basketPostValidator, async (c) => {
    const basketHandler = c.get("basketHandler");

    try {
      const basketID = await basketHandler.createBasket();
      return c.json({ id: basketID }, 201);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not create basket" }, 500);
    }
  })
  // Add a pizza to the basket
  .post("/:id/items", basketParamValidator, basketAddItemValidator, async (c) => {
    const basketHandler = c.get("basketHandler");
    const { id: basketID } = c.req.valid("param");
    const { pizzaID, quantity, price } = c.req.valid("json");

    try {
      await basketHandler.addPizzaToBasket({
        basketID,
        pizzaID,
        quantity,
        price: String(price),
      });
      return c.json({ success: true }, 201);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not add pizza to basket" }, 500);
    }
  })
  // Remove a pizza from the basket by basket item id
  .delete("/:id/items/:itemID", basketItemParamValidator, async (c) => {
    const basketHandler = c.get("basketHandler");
    const { id: basketID, itemID } = c.req.valid("param");

    try {
      await basketHandler.removePizzaFromBasket(basketID, itemID);
      return c.json({ success: true });
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not remove pizza from basket" }, 500);
    }
  });

export default router;
export { IBasketEnv };