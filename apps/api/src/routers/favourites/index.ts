import { Context, Hono } from "hono";
import { FavouritesHandler } from "../../db/favourites/handler";

interface IEnv {
  Bindings: CloudflareBindings;
}

/**
 * Helper type in case a function needs to accept the context parameter
 */
export type TContext<TEnv extends IEnv = IEnv> = Context<TEnv>;

/**
 * Helper for creating typed routers
 */
export function createRouter<TEnv extends IEnv = IEnv>() {
  return new Hono<TEnv>();
}

const app = createRouter();

/* ---------------------------------------------------
 * PUBLIC ROUTES
 * --------------------------------------------------- */

/**
 * GET /favourites?userId=123
 * Returns all favourites for a user.
 */
app.get("/", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "Missing userId" }, 400);
  }

  const handler = new FavouritesHandler(c.env.DB_URL);
  const favourites = await handler.getAllByUser(userId);

  return c.json(favourites);
});

/* ---------------------------------------------------
 * PROTECTED ROUTES
 * (You can add auth middleware later if needed)
 * --------------------------------------------------- */

/**
 * POST /favourites
 * Body: { userId, pizzaId }
 */
app.post("/", async (c) => {
  const body = await c.req.json();
  const { userId, pizzaId } = body;

  if (!userId || !pizzaId) {
    return c.json({ error: "userId and pizzaId are required" }, 400);
  }

  const handler = new FavouritesHandler(c.env.DB_URL);
  const created = await handler.addFavourite({
      userId, pizzaId,
      id: ""
  });

  return c.json(created, 201);
});

/**
 * DELETE /favourites?userId=123&pizzaId=999
 */
app.delete("/", async (c) => {
  const userId = c.req.query("userId");
  const pizzaId = c.req.query("pizzaId");

  if (!userId || !pizzaId) {
    return c.json({ error: "Missing userId or pizzaId" }, 400);
  }

  const handler = new FavouritesHandler(c.env.DB_URL);
  await handler.removeFavourite(userId, pizzaId);

  return c.json({ success: true });
});

/* ---------------------------------------------------
 * OPTIONAL: FIND ROUTE
 * GET /favourites/find?id=...&userId=...&pizzaId=...
 * --------------------------------------------------- */

app.get("/find", async (c) => {
  const id = c.req.query("id");
  const userId = c.req.query("userId");
  const pizzaId = c.req.query("pizzaId");

  const handler = new FavouritesHandler(c.env.DB_URL);

  const results = await handler.find({
    id: id ?? undefined,
    userId: userId ?? undefined,
    pizzaId: pizzaId ?? undefined,
  });

  return c.json(results);
});

export default app;
