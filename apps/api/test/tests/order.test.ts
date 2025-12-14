import { getDB } from "$db/index";
import { OrderHandler } from "$db/order/handler";
import { describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { BasketHandler } from "$db/basket/handler";
import { categoryTable } from "$db/category/schema";
import { pizzaTable } from "$db/pizza/schema";
import { z } from "zod/v4";

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

  // _________________________
  // positive tests:
  // _________________________

  it("creates an pickup order from a basket", async () => {
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

  it("creates pickup order with customerNote", async () => {
    const order = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Pickup",
      customerNote: "Ring doorbell twice",
    });

    expect(order.customerNote).toBe("Ring doorbell twice");
  });

  it("creates delivery order with address", async () => {
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
    expect(order).not.toHaveProperty("deliverFee");
  });

  it("includes deliveryFee in totalPrice calculation", async () => {
    const order = await orderHandler.createOrder({
      basketID: testBasketID,
      delivery: "Delivery",
      deliveryFee: 5.0,
      deliveryAddress: {
        street: "Main",
        number: "1",
        postalCode: "123",
        town: "City",
      },
    });

    expect(order.totalPrice).toBe(5002.5); // 4997.50 + 5
    expect(order).not.toHaveProperty("deliveryFee");
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

  // _________________________
  // negative testing:
  // _________________________

  it("throws error when basket is empty", async () => {
    const emptyBasketID = await basketHandler.createBasket();

    await expect(
      orderHandler.createOrder({
        basketID: emptyBasketID,
        delivery: "Pickup",
      }),
    ).rejects.toThrow("Basket is empty");
  });

  it("throws error when deliveryEnum invalid", async () => {
    await expect(
      orderHandler.createOrder({
        basketID: testBasketID,
        delivery: "Take Away" as "Pickup" | "Delivery",
      }),
    ).rejects.toThrow();
  });

  it("throws error when basketID not found", async () => {
    const nonExistentBasketID = crypto.randomUUID();

    await expect(
      orderHandler.createOrder({
        basketID: nonExistentBasketID,
        delivery: "Pickup",
      }),
    ).rejects.toThrow("Basket is empty");
  });

  // _________________________
  // totalPrice boundary tests (NUMERIC(6,2) - basket max 9,999.99)
  // _________________________
  it.each([
    {
      orderItems: [{ price: "0.00", qty: 1 }],
      expected: 0.0,
      description: "lower boundary min: 0.00 total",
    },
    {
      orderItems: [{ price: "0.01", qty: 1 }],
      expected: 0.01,
      description: "lower boundary: 0.01 total",
    },
    // Basket max with NUMERIC(6,2): 9,999.99
    {
      orderItems: [{ price: "9999.98", qty: 1 }],
      expected: 9999.98,
      description: "upper boundary max-1: 9,999.98",
    },
    {
      orderItems: [{ price: "9999.99", qty: 1 }],
      expected: 9999.99,
      description: "upper boundary max: 9,999.99",
    },
  ])(
    "creates order with totalPrice $description",
    async ({ orderItems, expected }) => {
      const basketID = await basketHandler.createBasket();
      for (const p of orderItems) {
        await basketHandler.addPizzaToBasket({
          basketID,
          pizzaID: testPizzaID,
          quantity: p.qty,
          price: p.price,
        });
      }

      const order = await orderHandler.createOrder({
        basketID,
        delivery: "Pickup",
      });

      expect(order.totalPrice).toBe(expected);
    },
  );
});

// _________________________
// _________________________
// Validation tests (Zod schema):
// _________________________
// _________________________

const deliveryAddressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  postalCode: z.string().min(1),
  town: z.string().min(1),
  doorFloor: z.string().min(1).optional(),
});

const orderPostSchema = z
  .object({
    basketID: z.string().uuid(),
    delivery: z.enum(["Pickup", "Delivery"]),
    deliveryFee: z.coerce.number().min(0).optional(),
    deliveryAddress: deliveryAddressSchema.optional(),
    customerNote: z
      .string()
      .trim()
      .max(500)
      .refine((val) => !/[<>]/.test(val), "Note cannot contain < or >")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.delivery === "Delivery") {
        return !!data.deliveryAddress;
      }
      return true;
    },
    {
      message: "Delivery address is required when delivery option is Delivery",
    },
  );

describe("Order validation (Zod schema)", () => {
  // _________________________
  // positive tests:
  // _________________________
  it("accepts valid Pickup order", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Pickup",
      customerNote: "Ring doorbell",
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid Delivery order", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Delivery",
      deliveryFee: 5.0,
      deliveryAddress: {
        street: "Main St",
        number: "123",
        postalCode: "12345",
        town: "Copenhagen",
      },
    });

    expect(result.success).toBe(true);
  });

  // _________________________
  // negative testing:
  // _________________________

  it("rejects missing basketID", () => {
    const result = orderPostSchema.safeParse({
      delivery: "Pickup",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("basketID");
    }
  });

  it("rejects invalid basketID format", () => {
    const result = orderPostSchema.safeParse({
      basketID: "not-a-uuid",
      delivery: "Pickup",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("basketID");
      expect(result.error.issues[0].message).toContain("Invalid UUID");
    }
  });

  it("rejects Delivery without address", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Delivery",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "Delivery address is required",
      );
    }
  });

  it("rejects Delivery with missing address fields", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Delivery",
      deliveryAddress: {
        street: "Guldbergsgade",
        // missing required fields: number, postalCode, town
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects customerNote with '<' character", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Pickup",
      customerNote: "Hello <script>",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cannot contain < or >");
    }
  });

  it("rejects customerNote with '>' character", () => {
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Pickup",
      customerNote: "Hello </script>",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cannot contain < or >");
    }
  });

  // __________________________________________________
  // parametized test for customerNote length validation
  // __________________________________________________
  it.each<[number, boolean, string]>([
    [0, true, "empty string (optional field)"],
    [1, true, "1 character"],
    [499, true, "499 characters"],
    [500, true, "500 characters (max)"],
    [501, false, "501 characters (over limit)"],
  ])("validates customerNote with length %d (%s)", (length, expected) => {
    const note = length === 0 ? "" : "a".repeat(length);
    const result = orderPostSchema.safeParse({
      basketID: "550e8400-e29b-41d4-a716-446655440000",
      delivery: "Pickup",
      customerNote: note,
    });

    expect(result.success).toBe(expected);
    if (!expected && !result.success) {
      expect(result.error.issues[0].path).toContain("customerNote");
    }
  });
});
