import { describe, it, expect, beforeEach } from "vitest";
import PizzaHandler from "../../src/db/pizza/handler";
import { getDB } from "$db/index";
import { pizzaTable } from "../../src/db/pizza/schema";
import { categoryTable } from "$db/category/schema";
import { env } from "cloudflare:test";

describe("PizzaHandler", {}, () => {
  let handler: PizzaHandler;
  let db: ReturnType<typeof getDB>;
  let categoryID: string;

  // reset and setup DB before each test
  beforeEach(async () => {
    const dbUrl = env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL env variable is missing!");
    }

    handler = new PizzaHandler(dbUrl, false);
    db = getDB(dbUrl, false);

    // Reset pizzas → categories
    await db.delete(pizzaTable).execute();
    await db.delete(categoryTable).execute();

    // Insert VALID category
    const catId = crypto.randomUUID();
    await db.insert(categoryTable).values({
      id: catId,
      name: "Test Category",
    });

    categoryID = catId;
  });

  // -------------------------------------------------------
  // Valid Pizza Operations Tests
  // -------------------------------------------------------

  // Valid pizza creation
  it("creates pizza with valid data", async () => {
    const newPizza = {
      name: "Margherita",
      price: "10.50",
      description: "Classic Italian pizza",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await handler.create(newPizza);

    const rows = await db.select().from(pizzaTable).execute();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("Margherita");
  });
});
