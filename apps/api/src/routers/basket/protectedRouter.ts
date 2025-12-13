import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { IBasketVariables } from ".";
import { injectBasketHandler } from "./middleware";

interface IProtectedBasketVariables
  extends IBasketVariables,
    TProtectedVariables {}

interface IProtectedBasketEnv extends IEnv {
  Variables: IProtectedBasketVariables;
}

const router = createRouter<IProtectedBasketEnv>()
  .use(requireAdmin)
  .use(injectBasketHandler)
  .get("/full", async (c) => {
    const basketHandler = c.get("basketHandler");
    try {
      const baskets = await basketHandler.getAllBaskets();
      return c.json(baskets);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch basket items" }, 500);
    }
  });

export default router;
