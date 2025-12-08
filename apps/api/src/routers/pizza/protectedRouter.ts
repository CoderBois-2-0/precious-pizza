import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { IPizzaVariables } from "./index";
import { injectPizzaHandler } from "./middleware";
import { pizzaPostValidator, pizzaPutValidator } from "./validation";

interface IProtectedPizzaVariables
  extends IPizzaVariables,
    TProtectedVariables {}

interface IProtectedPizzaEnv extends IEnv {
  Variables: IProtectedPizzaVariables;
}

const router = createRouter<IProtectedPizzaEnv>()
  .use(requireAdmin)
  .use(injectPizzaHandler)
  .post("/", pizzaPostValidator, async (c) => {
    const pizzaHandler = c.get("pizzaHandler");
    const pizzaRequst = c.req.valid("json");

    try {
      await pizzaHandler.create(pizzaRequst);

      return c.json({ message: "Created pizza" });
    } catch {
      return c.json({ message: "Could not create pizza" }, 500);
    }
  })
  .put("/:id", pizzaPutValidator, async (c) => {
    const pizzaHandler = c.get("pizzaHandler");
    const pizzaID = c.req.param("id");
    const pizzaRequst = c.req.valid("json");

    try {
      await pizzaHandler.update(pizzaID, pizzaRequst);

      return c.json({ message: "Updated pizza" });
    } catch {
      return c.json({ message: "Could not update pizza" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const pizzaHandler = c.get("pizzaHandler");
    const pizzaID = c.req.param("id");

    try {
      await pizzaHandler.delete(pizzaID);

      return c.json({ message: "Deleted pizza" });
    } catch {
      return c.json({ message: "Could not delete pizza" }, 500);
    }
  });

export default router;
