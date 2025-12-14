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
  let categoryId: string;
  let pizzaId: string;
  let userId: string;

  // reset and setup DB before each test
  beforeEach(async () => {
    const dbUrl = env.DB_URL;
    if (!dbUrl) throw new Error("DB_URL env variable is missing!");

    db = getDB(dbUrl, false);

    // BEGIN transaction
    await db.execute(sql`BEGIN`);

    // handler uses SAME db connection!
    handler = new FavouritesHandler(db);

    // Seed only required data
    categoryId = crypto.randomUUID();
    pizzaId = crypto.randomUUID();
    userId = crypto.randomUUID();

    await db.insert(categoryTable).values({
      id: categoryId,
      name: "Test Category",
    });

    await db.insert(pizzaTable).values({
      id: pizzaId,
      name: "Test Pizza",
      description: "Test Description",
      price: "10.99",
      isVisible: true,
      categoryID: categoryId,
      imageUrl: null,
    });
  });

  afterEach(async () => {
    await db.execute(sql`ROLLBACK`);
  });

  // -------------------------------------------------------
  // Valid Favourite Operations Tests
  // -------------------------------------------------------

  // Valid: Add pizza to favourites
  it("adds pizza to favourites when user is logged in and pizza is available", async () => {
    await handler.create({
      userId,
      pizzaId: pizzaId,
    });

    const rows = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId))
      .execute();

    expect(rows.length).toBe(1);
    expect(rows[0].pizzaId).toBe(pizzaId);
  });

  // Valid: Prevent duplicate favourites
  it("does not allow adding two of the same favourite pizza", async () => {
    await handler.create({ userId, pizzaId: pizzaId });
    await handler.create({ userId, pizzaId: pizzaId });
    const rows = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId))
      .execute();
    expect(rows.length).toBe(1);
  });

  // Valid: Remove pizza from favourites
  it("removes pizza from favourites when it exists", async () => {
    const [fav] = await handler.create({
      userId,
      pizzaId: pizzaId,
    });

    await handler.delete(fav.id);

    const rows = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId))
      .execute();

    expect(rows.length).toBe(0);
  });

  // Valid: Removal persists after subsequent read
  it("removed pizza remains unfavourited after subsequent fetch", async () => {
    const [fav] = await handler.create({
      userId,
      pizzaId: pizzaId,
    });

    await handler.delete(fav.id);

    const result = await handler.getAll({ userId });
    expect(result.length).toBe(0);
  });

  // -------------------------------------------------------
  // Invalid Favourite Operations Tests
  // -------------------------------------------------------

  // Invalid: Add favourite without user (not logged in)
  it("fails to add favourite when user is not logged in", async () => {
    // @ts-expect-error testing runtime validation
    await expect(handler.create({ pizzaId: pizzaId })).rejects.toThrow();
  });

  // Invalid: Add favourite without pizza
  it("fails to add favourite when pizzaId is missing", async () => {
    // @ts-expect-error testing runtime validation
    await expect(handler.create({ userId })).rejects.toThrow();
  });

  // Invalid: Remove non-existing favourite
  it("removing a non-existing favourite does nothing", async () => {
    await expect(
      handler.delete("00000000-0000-0000-0000-000000000000"),
    ).resolves.not.toThrow();

    const rows = await db.select().from(favouritesTable).execute();
    expect(rows.length).toBe(0);
  });

  // Invalid: Get favourites without userId
  it("getAll returns empty result when userId is missing", async () => {
    const result = await handler.getAll({});
    expect(result.length).toBe(0);
  });

  // -------------------------------------------------------
  // Boundary Tests – Favourites
  // -------------------------------------------------------

  // Boundary: favourites list count >= 0
  it("returns empty favourites list when user has 0 favourites", async () => {
    const result = await handler.getAll({ userId });
    expect(result.length).toBe(0);
  });

  // Boundary: favourites list count 0 → 1
  it("adds first favourite correctly (0 → 1)", async () => {
    await handler.create({
      userId,
      pizzaId: pizzaId,
    });

    const result = await handler.getAll({ userId });
    expect(result.length).toBe(1);
  });

  // Boundary: favourites list count 1 → 0
  it("removes last favourite correctly (1 → 0)", async () => {
    const [fav] = await handler.create({
      userId,
      pizzaId: pizzaId,
    });

    await handler.delete(fav.id);

    const result = await handler.getAll({ userId });
    expect(result.length).toBe(0);
  });
});
