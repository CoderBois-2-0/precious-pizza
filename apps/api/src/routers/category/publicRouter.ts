import { createRouter } from "$routers/util";
import { IEnv } from "$routers/types";
import CategoryHandler from "$db/category/handler";

interface ICategoryVariables {
  categoryHandler: CategoryHandler;
}

interface ICategoryEnv extends IEnv {
  Variables: ICategoryVariables;
}

const router = createRouter<ICategoryEnv>()
  .use((c, next) => {
    const categoryHandler = new CategoryHandler(c.env.DB_URL, c.env.ENVIRONMENT !== "production");
    c.set("categoryHandler", categoryHandler);
    return next();
  })
  .get("/", async (c) => {
    const categoryHandler = c.get("categoryHandler");

    try {
      const categories = await categoryHandler.getAll();
      return c.json(categories);
    } catch (e) {
      console.log(e);
      return c.json({ message: "Could not fetch categories" }, 500);
    }
  });

export default router;
