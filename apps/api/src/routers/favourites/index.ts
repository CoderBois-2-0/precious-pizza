import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { FavouritesHandler } from "../../db/favourites/handler";
import { getDB } from "$db/index";

interface IFavouritesVariables extends TProtectedVariables {
  favouritesHandler: FavouritesHandler;
}

interface IFavouritesEnv extends IEnv {
  Variables: IFavouritesVariables;
}

const router = createRouter<IFavouritesEnv>()
  .use((c, next) => {
    // Create DB client (same pattern as tests)
    const db = getDB(c.env.DB_URL, c.env.ENVIRONMENT !== "production");

    // Pass DB client into handler
    const favouritesHandler = new FavouritesHandler(db);
    c.set("favouritesHandler", favouritesHandler);

    return next();
  })

  .get("/", async (c) => {
    const user = c.get("jwtPayload");
    const handler = c.get("favouritesHandler");

    const favourites = await handler.getAll({
      userId: user.id,
    });

    return c.json(favourites);
  })

  .post("/", async (c) => {
    const user = c.get("jwtPayload");
    const body = await c.req.json();
    const { pizzaId } = body;

    if (!pizzaId) {
      return c.json({ error: "pizzaId is required" }, 400);
    }

    const handler = c.get("favouritesHandler");

    const created = await handler.create({
      userId: user.id,
      pizzaId,
    });

    return c.json(created, 201);
  })

  .delete("/:id", async (c) => {
    const favouriteID = c.req.param("id");
    const handler = c.get("favouritesHandler");

    await handler.delete(favouriteID);

    return c.json({ success: true });
  })

  .get("/find", async (c) => {
    const id = c.req.query("id");
    const userId = c.req.query("userId");
    const pizzaId = c.req.query("pizzaId");

    const handler = c.get("favouritesHandler");

    const results = await handler.find({
      id: id ?? undefined,
      userId: userId ?? undefined,
      pizzaId: pizzaId ?? undefined,
    });

    return c.json(results);
  });

export default router;
