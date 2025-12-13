import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDB } from "$db/index";
import { env } from "cloudflare:workers";
import { sql, eq } from "drizzle-orm";

import { categoryTable } from "$db/category/schema";
import { pizzaTable } from "$db/pizza/schema";
import { favouritesTable } from "../../src/db/favourites/schema";
import { FavouritesHandler } from "../../src/db/favourites/handler";

describe("FavouritesHandler", () => {
  let handler: FavouritesHandler;
  let db: ReturnType<typeof getDB>;
  let categoryID: string;
  let pizzaID: string;
  let userID: string;

  // reset and setup DB before each test
  beforeEach(async () => {
    const dbUrl = env.DB_URL;
    if (!dbUrl) throw new Error("DB_URL env variable is missing!");

    db = getDB(dbUrl, false);

    // BEGIN transaction
    await db.execute(sql`BEGIN`);

    // handler uses SAME db connection
    handler = new FavouritesHandler(db);

    // Seed only required data
    categoryID = crypto.randomUUID();
    pizzaID = crypto.randomUUID();
    userID = crypto.randomUUID();

    await db.insert(categoryTable).values({
      id: categoryID,
      name: "Test Category",
    });

    await db.insert(pizzaTable).values({
      id: pizzaID,
      name: "Test Pizza",
      description: "Test Description",
      price: "10.99",
      isVisible: true,
      categoryID,
      imageUrl: null,
    });
  });

  afterEach(async () => {
    await db.execute(sql`ROLLBACK`);
  });

  // -------------------------------------------------------
  // Valid Add-to-Favourites Tests (Equivalence Partition)
  // -------------------------------------------------------

  it("adds pizza to favourites when user is logged in and pizza is available", async () => {
    await handler.create({
      userId: userID,
      pizzaId: pizzaID,
    });

    const rows = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userID));

    expect(rows.length).toBe(1);
    expect(rows[0].pizzaId).toBe(pizzaID);
  });
});
