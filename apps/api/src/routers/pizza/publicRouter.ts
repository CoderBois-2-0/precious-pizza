import { IEnv } from "$routers/types";
import { createRouter } from "$routers/util";
import { IPizzaVariables } from "./index";
import { injectPizzaHandler } from "./middleware";
import { pizzaQueryValidator } from "./validation";

interface IPizzaEnv extends IEnv {
  Variables: IPizzaVariables;
}

const router = createRouter<IPizzaEnv>()
  .use(injectPizzaHandler)
  .get("/", pizzaQueryValidator, async (c) => {
    const pizzaHandler = c.get("pizzaHandler");
    const query = c.req.valid("query");

    try {
      const pizzas = await pizzaHandler.getAll({
        ...query,
        order: {
          limit: query.limit,
          offset: query.page ? (query.page - 1) * query.limit : undefined,
        },
      });

      return c.json(pizzas);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch pizzas" }, 500);
    }
  });

export default router;
export { IPizzaEnv };
