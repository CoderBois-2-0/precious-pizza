import { describe, it, expect, beforeEach, afterEach } from "vitest";
import PizzaHandler from "../../src/db/pizza/handler";
import { getDB } from "$db/index";
import { pizzaTable } from "../../src/db/pizza/schema";
import { categoryTable } from "$db/category/schema";
import { env } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";

describe("PizzaHandler", {}, () => {
  let handler: PizzaHandler;
  type GetAllInput = Parameters<PizzaHandler["getAll"]>[0];
  let db: ReturnType<typeof getDB>;
  let categoryID: string;

  // reset and setup DB before each test
  beforeEach(async () => {
    const dbUrl = env.DB_URL;
    if (!dbUrl) throw new Error("DB_URL env variable is missing!");

    db = getDB(dbUrl, false);

    // BEGIN transaction
    await db.execute(sql`BEGIN`);

    // handler uses SAME db connection
    handler = new PizzaHandler(db);

    // Seed only required data
    const catId = crypto.randomUUID();
    await db.insert(categoryTable).values({
      id: catId,
      name: "Test Category",
    });

    categoryID = catId;
  });

  // rollback any changes after each test
  afterEach(async () => {
    await db.execute(sql`ROLLBACK`);
  });

  // -------------------------------------------------------
  // Valid Pizza Operations Tests
  // -------------------------------------------------------

  // Valid pizza creation
  it("creates pizza with valid data", async () => {
    const uniqueName = `Test-${crypto.randomUUID()}`;
    const newPizza = {
      name: uniqueName,
      price: "10.50",
      description: "Classic Italian pizza",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await handler.create(newPizza);

    const rows = await db
      .select()
      .from(pizzaTable)
      .where(eq(pizzaTable.name, uniqueName))
      .execute();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe(uniqueName);
    expect(rows[0].price).toBe("10.50");
  });

  // Valid pizza update
  it("updates pizza with valid data", async () => {
    const id = crypto.randomUUID();
    await db.insert(pizzaTable).values({
      id,
      name: "Old Name",
      price: "9.99",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    });

    await handler.update(id, { name: "Pepperoni" });

    const updated = await db
      .select()
      .from(pizzaTable)
      .where(eq(pizzaTable.id, id))
      .execute();

    expect(updated[0].name).toBe("Pepperoni");
  });

  // Valid pizza deletion
  it("deletes pizza with valid ID", async () => {
    const id = crypto.randomUUID();
    await db.insert(pizzaTable).values({
      id,
      name: "ToDelete",
      price: "5.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    });

    await handler.delete(id);

    const rows = await db
      .select()
      .from(pizzaTable)
      .where(eq(pizzaTable.id, id))
      .execute();

    expect(rows.length).toBe(0);
  });

  // -------------------------------------------------------
  // Inalid Pizza Operations Tests!
  // -------------------------------------------------------

  // Invalid pizza creation
  it("fails to create pizza with missing name or price", async () => {
    const invalidPizza = {
      price: "9.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    // We EXPECT a type error here because name is missing
    // @ts-expect-error testing runtime validation
    await expect(handler.create(invalidPizza)).rejects.toThrow();
  });

  // Invalid pizza update
  it("updating a non-existing pizza does not update anything", async () => {
    const nonExistingId = "00000000-0000-0000-0000-000000000000";

    // Act
    await expect(
      handler.update(nonExistingId, { name: "Nope" }),
    ).resolves.not.toThrow();

    // Assert: verify the non-existing ID was not created
    const rows = await db
      .select()
      .from(pizzaTable)
      .where(eq(pizzaTable.id, nonExistingId))
      .execute();
    expect(rows.length).toBe(0);
  });

  // Invalid pizza deletion
  it("deleting a non-existing pizza does nothing", async () => {
    await expect(
      handler.delete("00000000-0000-0000-0000-000000000000"), // non-existing ID
    ).resolves.not.toThrow();
  });

  // Invalid query parameters
  it("getAll returns empty result for invalid categoryID", async () => {
    const result = await handler.getAll({
      categoryID: "00000000-0000-0000-0000-000000000000",
    } satisfies GetAllInput);

    expect(result.length).toBe(0);
  });

  // -------------------------------------------------------
  // boundary tests
  // -------------------------------------------------------

  // Boundary test: name length >= 1
  it("fails when name length < 1", async () => {
    const pizza = {
      name: "", // Invalid: empty string
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    // Expect the handler to reject the promise with a specific error
    await expect(handler.create(pizza)).rejects.toThrow(
      "Name must be at least 1 character",
    );
  });

  it("succeeds when name length = 1", async () => {
    const pizza = {
      name: "a", // 1 char
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await expect(handler.create(pizza)).resolves.not.toThrow();
  });

  it("succeeds when name length > 1", async () => {
    const pizza = {
      name: "ab", // 2 chars
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await expect(handler.create(pizza)).resolves.not.toThrow();
  });

  it("succeeds when name is 49 chars", async () => {
    const pizza = {
      name: "x".repeat(49), // 49 chars
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await expect(handler.create(pizza)).resolves.not.toThrow();
  });

  // Boundary test: name length <= 50
  it("succeeds when name is exactly 50 chars", async () => {
    const pizza = {
      name: "x".repeat(50), // 50 chars
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await expect(handler.create(pizza)).resolves.not.toThrow();
  });

  // Boundary test: name length <= 50
  it("fails when name exceeds 50 chars", async () => {
    const pizza = {
      name: "x".repeat(51), // 51 chars
      price: "10.00",
      description: "desc",
      imageUrl: null,
      isVisible: true,
      categoryID,
    };

    await expect(handler.create(pizza)).rejects.toThrow();
  });
});
