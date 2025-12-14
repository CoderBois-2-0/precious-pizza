import { getDB } from "$db/index";
import { BasketHandler } from "$db/basket/handler";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { categoryTable } from "$db/category/schema";
import { pizzaTable } from "$db/pizza/schema";

const dbUrl = env.DB_URL;
const db = getDB(dbUrl, false);

describe("BasketHandler", () => {
  let basketHandler: BasketHandler;
  let testPizzaID: string;
  let testPizzaID2: string;
  let testCategoryID: string;

  beforeEach(async () => {
    if (!dbUrl) throw new Error("DB_URL env variable is missing!");
    await db.execute(sql`BEGIN`);

    basketHandler = new BasketHandler(db);

    // Create test category
    testCategoryID = crypto.randomUUID();
    await db.insert(categoryTable).values({
      id: testCategoryID,
      name: "Test Category",
    });

    // Create test pizzas
    testPizzaID = crypto.randomUUID();
    await db.insert(pizzaTable).values({
      id: testPizzaID,
      name: "Margherita",
      price: "10.99",
      description: "Classic margherita",
      isVisible: true,
      categoryID: testCategoryID,
    });

    testPizzaID2 = crypto.randomUUID();
    await db.insert(pizzaTable).values({
      id: testPizzaID2,
      name: "Pepperoni",
      price: "12.99",
      description: "Spicy pepperoni",
      isVisible: true,
      categoryID: testCategoryID,
    });
  });

  afterEach(async () => {
    await db.execute(sql`ROLLBACK`);
  });

  // _________________________
  // Positive tests
  // _________________________

  it("creates a new basket", async () => {
    const basketID = await basketHandler.createBasket();

    expect(basketID).toBeDefined();
    expect(typeof basketID).toBe("string");
  });

  it("adds pizza to basket", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 2,
      price: "10.99",
    });

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.items.length).toBe(1);
    expect(basket.items[0].pizzaID).toBe(testPizzaID);
    expect(basket.items[0].quantity).toBe(2);
    expect(basket.totalPrice).toBe("21.98");
  });

  it("increments quantity when adding same pizza twice", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 1,
      price: "10.99",
    });

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 2,
      price: "10.99",
    });

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.items.length).toBe(1);
    expect(basket.items[0].quantity).toBe(3);
    expect(basket.totalPrice).toBe("32.97");
  });

  it("adds multiple different pizzas to basket", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 2,
      price: "10.99",
    });

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID2,
      quantity: 1,
      price: "12.99",
    });

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.items.length).toBe(2);
    expect(basket.totalPrice).toBe("34.97"); // (10.99 * 2) + 12.99
  });

  it("removes pizza from basket", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 2,
      price: "10.99",
    });

    const items = await basketHandler.getBasketItems(basketID);
    const itemID = items[0]?.id;
    if (!itemID) throw new Error("Item ID not found");

    await basketHandler.removePizzaFromBasket(basketID, itemID);

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.items.length).toBe(0);
    expect(basket.totalPrice).toBe("0.00");
  });

  it("retrieves basket items with pizza info", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 1,
      price: "10.99",
    });

    const items = await basketHandler.getBasketItems(basketID);
    expect(items.length).toBe(1);
    expect(items[0].name).toBe("Margherita");
    expect(items[0].price).toBe(10.99);
  });

  it("retrieves full basket with all details", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 3,
      price: "10.99",
    });

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.id).toBe(basketID);
    expect(basket.totalPrice).toBe("32.97");
    expect(basket.items.length).toBe(1);
    expect(basket.createdAt).toBeDefined();
  });

  it("updates basket total after removing items", async () => {
    const basketID = await basketHandler.createBasket();

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 2,
      price: "10.99",
    });

    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID2,
      quantity: 1,
      price: "12.99",
    });

    const items = await basketHandler.getBasketItems(basketID);
    const itemID = items[0]?.id;
    if (!itemID) throw new Error("Item ID not found");

    await basketHandler.removePizzaFromBasket(basketID, itemID);

    const newTotal = await basketHandler.updateBasketTotal(basketID);
    expect(newTotal).toBe("12.99");
  });

  // _________________________
  // Negative tests
  // _________________________

  it("throws error when retrieving non-existent basket", async () => {
    const fakeBasketID = crypto.randomUUID();

    await expect(basketHandler.getFullBasket(fakeBasketID)).rejects.toThrow(
      "Basket not found",
    );
  });

  it("rejects basket when total exceeds NUMERIC(6,2) max (9,999.99)", async () => {
    const basketID = await basketHandler.createBasket();
    await basketHandler.addPizzaToBasket({
      basketID,
      pizzaID: testPizzaID,
      quantity: 999,
      price: "10.00",
    });

    await expect(
      basketHandler.addPizzaToBasket({
        basketID,
        pizzaID: testPizzaID,
        quantity: 1,
        price: "10.00",
      }),
    ).rejects.toThrow("Basket total cannot exceed 9,999.99 or be below 0.00");
  });

  // _________________________
  // Parameterized tests
  // _________________________

  it.each<[number, string, number]>([
    [1, "10.99", 10.99],
    [2, "10.99", 21.98],
    [5, "12.50", 62.5],
    [10, "9.99", 99.9],
    [100, "5.00", 500.0],
  ])(
    "calculates correct total for quantity %d at price %s (expected: %d)",
    async (quantity, price, expected) => {
      const basketID = await basketHandler.createBasket();

      await basketHandler.addPizzaToBasket({
        basketID,
        pizzaID: testPizzaID,
        quantity,
        price,
      });

      const basket = await basketHandler.getFullBasket(basketID);
      expect(Number(basket.totalPrice)).toBe(expected);
    },
  );

  it.each<[string, boolean, string]>([
    ["0.00", true, "lower boundary: 0.00"],
    ["0.01", true, "minimum positive value"],
    ["9999.98", true, "upper boundary - 0.01"],
    ["9999.99", true, "upper boundary: 9,999.99"],
  ])("accepts basket total of %s (%s)", async (price) => {
    const basketID = await basketHandler.createBasket();

    await expect(
      basketHandler.addPizzaToBasket({
        basketID,
        pizzaID: testPizzaID,
        quantity: 1,
        price,
      }),
    ).resolves.not.toThrow();

    const basket = await basketHandler.getFullBasket(basketID);
    expect(basket.totalPrice).toBe(price);
  });

  it.each<[{ qty: number; price: string }[], string]>([
    [
      [
        { qty: 2, price: "10.00" },
        { qty: 1, price: "15.50" },
      ],
      "35.50",
    ],
    [
      [
        { qty: 1, price: "5.99" },
        { qty: 3, price: "8.50" },
      ],
      "31.49",
    ],
    [
      [
        { qty: 10, price: "2.50" },
        { qty: 5, price: "3.00" },
      ],
      "40.00",
    ],
  ])(
    "calculates correct total for multiple items: %s",
    async (items, expectedTotal) => {
      const basketID = await basketHandler.createBasket();

      for (let i = 0; i < items.length; i++) {
        const pizzaID = i === 0 ? testPizzaID : testPizzaID2;
        await basketHandler.addPizzaToBasket({
          basketID,
          pizzaID,
          quantity: items[i].qty,
          price: items[i].price,
        });
      }

      const basket = await basketHandler.getFullBasket(basketID);
      expect(basket.totalPrice).toBe(expectedTotal);
    },
  );
});
