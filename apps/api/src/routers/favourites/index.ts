import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { FavouritesHandler } from "../../db/favourites/handler";

interface IFavourtesVariables extends TProtectedVariables {
  favouritesHandler: FavouritesHandler;
}

interface IFavouritesEnv extends IEnv {
  Variables: IFavourtesVariables;
}

const router = createRouter<IFavouritesEnv>()
  .use((c, next) => {
    const favouritesHandler = new FavouritesHandler(
      c.env.DB_URL,
      c.env.ENVIRONMENT !== "production",
    );
    c.set("favouritesHandler", favouritesHandler);

    return next();
  })
  .get("/", async (c) => {
    const user = c.get("jwtPayload");

    const handler = c.get("favouritesHandler");
    const favourites = await handler.getAllByUser(user.id);

    return c.json(favourites);
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    const { userId, pizzaId } = body;

    if (!userId || !pizzaId) {
      return c.json({ error: "userId and pizzaId are required" }, 400);
    }

    const handler = c.get("favouritesHandler");
    const created = await handler.addFavourite({
      userId,
      pizzaId,
      id: "",
    });

    return c.json(created, 201);
  })
  .delete("/", async (c) => {
    const userId = c.req.query("userId");
    const pizzaId = c.req.query("pizzaId");

    if (!userId || !pizzaId) {
      return c.json({ error: "Missing userId or pizzaId" }, 400);
    }

    const handler = c.get("favouritesHandler");
    await handler.removeFavourite(userId, pizzaId);

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
