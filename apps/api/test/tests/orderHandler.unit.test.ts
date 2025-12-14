import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderHandler } from "../../src/db/order/handler";
import { orderTable } from "../../src/db/order/schema";
import { basketItemTable } from "../../src/db/basketItem/schema";
import { orderItemTable } from "../../src/db/orderItem/schema";
import type { IOrder } from "../../src/db/order/types";
import type { TDB } from "../../src/db";

// Raw DB query result before normalization (price is string, name can be null from left join)
type RawOrderItem = {
  pizzaID: string;
  name: string | null;
  quantity: number;
  price: string;
};

function createMockDB({
  basketItems = [],
  orderRow,
  itemsRaw = [],
}: {
  basketItems?: Array<{ price: string; quantity: number; pizzaID: string }>;
  orderRow?: IOrder;
  itemsRaw?: RawOrderItem[];
}) {
  const selectMock = vi.fn(() => ({
    from: vi.fn((table) => {
      const chain = {
        leftJoin: vi.fn(() => chain),
        where: vi.fn(() => {
          if (table === basketItemTable) return basketItems;
          if (table === orderTable) return orderRow ? [orderRow] : [];
          if (table === orderItemTable) return itemsRaw;
          return [];
        }),
      };
      return chain;
    }),
  }));

  const insertMock = vi.fn((table) => ({
    values: vi.fn((payload) => {
      return {
        returning: vi.fn(() => {
          if (table === orderTable) {
            // Return the order with the calculated totalPrice from payload
            return orderRow ? [{ ...orderRow, ...payload }] : [];
          }
          return [];
        }),
      };
    }),
  }));

  const mockDB = {
    select: selectMock,
    insert: insertMock,
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => {}) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => {}) })),
    transaction: vi.fn(async (cb) => cb(mockDB)),
  } as unknown as TDB;

  return mockDB;
}

describe("OrderHandler (Unit)", () => {
  let basketItems: Array<{ price: string; quantity: number; pizzaID: string }>;
  let orderRow: IOrder;

  beforeEach(() => {
    basketItems = [
      { price: "19.99", quantity: 2, pizzaID: "pizza-1" },
      { price: "10.50", quantity: 1, pizzaID: "pizza-2" },
    ];

    orderRow = {
      id: "order-1",
      basketID: "basket-1",
      userID: null,
      totalPrice: "0.00",
      deliveryOption: "Pickup",
      street: null,
      number: null,
      postalCode: null,
      town: null,
      doorFloor: null,
      customerNote: null,
      status: "Pending",
      createdAt: new Date(),
    };
  });

  it("createOrder calculates total including delivery fee and returns normalized order", async () => {
    const mockDB = createMockDB({ basketItems, orderRow });
    const handler = new OrderHandler(mockDB);

    const result = await handler.createOrder({
      basketID: "basket-1",
      delivery: "Delivery",
      deliveryFee: 5.0,
      deliveryAddress: {
        street: "Main",
        number: "1",
        postalCode: "1234",
        town: "Town",
      },
    });

    // 2 * 19.99 + 1 * 10.50 + 5.0 = 55.48
    expect(result.totalPrice).toBe(55.48);
    expect(result.deliveryOption).toBe("Delivery");
  });

  it("createOrder throws when basket is empty", async () => {
    const mockDB = createMockDB({ basketItems: [], orderRow });
    const handler = new OrderHandler(mockDB);

    await expect(
      handler.createOrder({ basketID: "basket-1", delivery: "Pickup" }),
    ).rejects.toThrow("Basket is empty");
  });

  it("getById normalizes totalPrice from string to number", async () => {
    const mockDB = createMockDB({
      orderRow: { ...orderRow, totalPrice: "12.50" },
    });
    const handler = new OrderHandler(mockDB);

    const order = await handler.getById("order-1");
    expect(order?.totalPrice).toBe(12.5);
  });

  it("getFullOrder returns items with numeric prices", async () => {
    const mockDB = createMockDB({
      orderRow: { ...orderRow, totalPrice: "30.00" },
      itemsRaw: [
        { pizzaID: "p1", name: "Margherita", quantity: 2, price: "10.99" },
        { pizzaID: "p2", name: null, quantity: 1, price: "8.50" },
      ],
    });
    const handler = new OrderHandler(mockDB);

    const full = await handler.getFullOrder("order-1");
    expect(full).not.toBeNull();
    expect(full?.items[0].price).toBe(10.99);
    expect(full?.items[1].name).toBe("Unknown Pizza");
    expect(full?.totalPrice).toBe(30.0);
  });
});
