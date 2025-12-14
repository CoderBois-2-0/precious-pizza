import { getDB } from "$db/index";
import { OrderHandler } from "$db/order/handler";
import { describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import { env } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";
import { BasketHandler } from "$db/basket/handler";
import { categoryTable } from "$db/category/schema";
import { pizzaTable } from "$db/pizza/schema";
// import { z } from "zod/v4";

const dbUrl = env.DB_URL;
const db = getDB(dbUrl, false);

describe("OrderHandler", {}, () => {
  let orderHandler: OrderHandler;
  let basketHandler: BasketHandler;
  let testBasketID: string;
  let testPizzaID: string;
  let testCategoryID: string;

  beforeAll(async () => {
    orderHandler = new OrderHandler(db);
    basketHandler = new BasketHandler(db);

    // Create test category
    testCategoryID = crypto.randomUUID();
    await db.insert(categoryTable).values({
      id: testCategoryID,
      name: "Test Category",
    });

    // Create test pizza
    testPizzaID = crypto.randomUUID();
    const testPizza = {
      id: testPizzaID,
      name: "Test Pizza",
      price: "19.99",
      description: "A test pizza for unit tests",
      isVisible: true,
      categoryID: testCategoryID,
    };

    await db.insert(pizzaTable).values({
      id: testPizzaID,
      name: testPizza.name,
      price: testPizza.price,
      description: testPizza.description,
      isVisible: testPizza.isVisible,
      categoryID: testCategoryID,
    });

    // Setup: Create a basket with items
    testBasketID = await basketHandler.createBasket();
    await basketHandler.addPizzaToBasket({
      basketID: testBasketID,
      pizzaID: testPizzaID,
      quantity: 250,
      price: testPizza.price,
    });
  });

  beforeEach(async () => {
    if (!dbUrl) throw new Error("DB_URL env variable is missing!");

    // BEGIN transaction
    await db.execute(sql`BEGIN`);
  });

  // rollback any changes after each test
  afterEach(async () => {
    await db.execute(sql`ROLLBACK`);
  });

  it("creates an order from a basket", async () => {
    const order = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Pickup",
      deliveryFee: 0,
    });

    expect(order).toHaveProperty("id");
    expect(order.basketID).toBe(testBasketID);
    expect(order.totalPrice).toBe(250 * 19.99); // 4997.50
    expect(order.deliveryOption).toBe("Pickup");
    expect(order.status).toBe("Pending");
  });

  it("creates order with customerNote", async () => {
    const order = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Pickup",
      customerNote: "Ring doorbell twice",
    });

    expect(order.customerNote).toBe("Ring doorbell twice");
  });

  it("creates order with delivery address", async () => {
    const order = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Delivery",
      deliveryFee: 2.0,
      deliveryAddress: {
        street: "Nørrebrogade",
        number: "123",
        postalCode: "1234",
        town: "København N",
      },
    });

    expect(order.deliveryOption).toBe("Delivery");
    expect(order.totalPrice).toBe(4999.5);
    expect(order.town).toBe("København N");
    expect(order.street).toBe("Nørrebrogade");
    expect(order.number).toBe("123");
    expect(order.postalCode).toBe("1234");
  });

  it("throws error when basket is empty", async () => {
    const emptyBasketID = await basketHandler.createBasket();

    await expect(
      orderHandler.createOrder({
        basketID: emptyBasketID,
        delivery: "Pickup",
      }),
    ).rejects.toThrow("Basket is empty");
  });

  it("retrieves order by ID", async () => {
    const created = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Pickup",
    });

    const retrieved = await orderHandler.getById(created.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(created.id);
  });

  it("retrieves full order with items", async () => {
    const created = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Pickup",
    });

    const full = await orderHandler.getFullOrder(created.id);
    expect(full).not.toBeNull();
    expect(full?.items).toBeDefined();
    expect(full?.items.length).toBeGreaterThan(0);
    expect(full?.items[0]).toHaveProperty("pizzaID", testPizzaID);
  });
});

// // Your validator schema
// const orderPostSchema = z
//   .object({
//     basketID: z.string().uuid(),
//     delivery: z.enum(["Pickup", "Delivery"]),
//     deliveryAddress: z
//       .object({
//         street: z.string().optional(),
//         number: z.string().optional(),
//         postalCode: z.string().optional(),
//         town: z.string().optional(),
//         doorFloor: z.string().optional(),
//       })
//       .optional(),
//     customerNote: z.string().min(1).max(500).optional(),
//   })
//   .strict();

// describe("Order validation - customerNote", () => {
//   // Valid cases
//   it("accepts undefined customerNote", () => {
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       // customerNote omitted
//     });
//     expect(result.success).toBe(true);
//   });

//   it("accepts non-empty customerNote", () => {
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       customerNote: "Please ring doorbell twice",
//     });
//     expect(result.success).toBe(true);
//   });

//   it("accepts max length (500 chars)", () => {
//     const longNote = "a".repeat(500);
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       customerNote: longNote,
//     });
//     expect(result.success).toBe(true);
//   });

//   // Invalid cases
//   it("rejects empty string", () => {
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       customerNote: "",
//     });
//     expect(result.success).toBe(false);
//     expect(result.error?.issues[0].path).toContain("customerNote");
//   });

//   it("rejects string over 500 chars", () => {
//     const tooLong = "a".repeat(501);
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       customerNote: tooLong,
//     });
//     expect(result.success).toBe(false);
//     expect(result.error?.issues[0].path).toContain("customerNote");
//   });

//   it("rejects customerNote with HTML tags", () => {
//     const result = orderPostSchema.safeParse({
//       basketID: "550e8400-e29b-41d4-a716-446655440000",
//       delivery: "Pickup",
//       customerNote: '<script>alert("xss")</script>',
//     });
//     expect(result.success).toBe(false);
//     expect(result.error?.issues[0].message).toContain("cannot contain < or >");
//   });
// });
