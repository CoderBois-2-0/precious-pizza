/*
import { describe, it, expect, beforeAll, vi } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { FavouritesHandler } from "../db/favourites/handler";



describe("FavouritesHandler", () => {
  let handler: FavouritesHandler;
  let db: ReturnType<typeof drizzle>;
  let client: any;

  beforeAll(async () => {
    // Create in-memory Postgres
    client = createMemClient();
    db = drizzle(client);

    // Create users and pizzas tables (varchar(36))
    await client.query(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY
      );
    `);

    await client.query(`
      CREATE TABLE pizzas (
        id VARCHAR(36) PRIMARY KEY
      );
    `);

    // Mock getDB() to return in-memory db
    vi.mock("$db/index", () => ({
      getDB: () => db,
    }));

    handler = new FavouritesHandler("fake-url"); // dbUrl won't matter
  });

  it("can add and get favourites", async () => {
    const [added] = await handler.addFavourite({
      id: "fav-1",
      userId: "1",
      pizzaId: "5",
    });

    expect(added.userId).toBe("1");
    expect(added.pizzaId).toBe("5");

    const favs = await handler.getAllByUser("1");
    expect(favs.length).toBe(1);
    expect(favs[0].pizzaId).toBe("5");
  });

  it("can remove a favourite", async () => {
    await handler.addFavourite({
      id: "fav-2",
      userId: "2",
      pizzaId: "7",
    });

    let favs = await handler.getAllByUser("2");
    expect(favs.length).toBe(1);

    await handler.removeFavourite("2", "7");

    favs = await handler.getAllByUser("2");
    expect(favs.length).toBe(0);
  });

  it("can find favourites with filters", async () => {
    await handler.addFavourite({
      id: "fav-3",
      userId: "3",
      pizzaId: "9",
    });

    const results = await handler.find({ userId: "3" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].pizzaId).toBe("9");
  });
});
*/
