import CategoryHandler from "$db/category/handler";
import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { categoryPostValidator, categoryPutValidator } from "./validation";

interface IProtectedCategoryVariables extends TProtectedVariables {
  categoryHandler: CategoryHandler;
}

interface IProtectedCategoryEnv extends IEnv {
  Variables: IProtectedCategoryVariables;
}

const rotuer = createRouter<IProtectedCategoryEnv>()
  .use(requireAdmin)
  .use((c, next) => {
    const categoryHandler = new CategoryHandler(
      c.env.DB_URL,
      c.env.ENVIRONMENT !== "production",
    );
    c.set("categoryHandler", categoryHandler);

    return next();
  })
  .get("/", async (c) => {
    const categoryHandler = c.get("categoryHandler");

    try {
      const categories = await categoryHandler.getAll();

      return c.json(categories);
    } catch {
      return c.json({ message: "Could not fetch categories" }, 500);
    }
  })
  .post("/", categoryPostValidator, async (c) => {
    const categoryHandler = c.get("categoryHandler");
    const categoryRequest = c.req.valid("json");

    try {
      await categoryHandler.create(categoryRequest);

      return c.json({ message: "Category created" }, 201);
    } catch {
      return c.json({ message: "Could not create category" }, 500);
    }
  })
  .put("/:id", categoryPutValidator, (c) => {
    const categoryHandler = c.get("categoryHandler");
    const categoryID = c.req.param("id");
    const categoryRequest = c.req.valid("json");

    try {
      categoryHandler.update(categoryID, categoryRequest);

      return c.json({ message: "Category updated" });
    } catch {
      return c.json({ message: "Could not update category" }, 500);
    }
  })
  .delete("/:id", (c) => {
    const categoryHandler = c.get("categoryHandler");
    const categoryID = c.req.param("id");

    try {
      categoryHandler.delete(categoryID);

      return c.json({ message: "Category deleted" });
    } catch {
      return c.json({ message: "Could not delete category" }, 500);
    }
  });

export default rotuer;
