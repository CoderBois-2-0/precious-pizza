import { eq } from "drizzle-orm";
import { orderTable } from "./schema";
import { basketItemTable } from "../basketItem/schema";
import { orderItemTable } from "../orderItem/schema";
import { TDB } from "..";
import { pizzaTable } from "../pizza/schema";
import {
  IFullOrder,
  INewOrder,
  IOrder,
  IOrderInsert,
  IOrderItemQuery,
  TOrderTable,
} from "./types";

// DB row return price columns as strings;
type IOrderRow = Omit<IOrder, "totalPrice"> & { totalPrice: string | number };

class OrderHandler {
  readonly #client: TDB;
  readonly #table: TOrderTable;

  constructor(db: TDB) {
    this.#client = db;
    this.#table = orderTable;
  }

  // Normalize DB order where totalPrice is stored as string
  private normalizeOrder(raw: IOrderRow): IOrder {
    const normalized = {
      ...raw,
      totalPrice: Number(raw.totalPrice),
    };
    return normalized as unknown as IOrder;
  }

  // Create a new order from a basket
  async createOrder(input: INewOrder): Promise<IOrder> {
    const {
      basketID,
      delivery,
      deliveryFee = 0,
      deliveryAddress,
      customerNote,
      userID,
    } = input;

    // 1. Fetch basket items
    const basketItems = await this.#client
      .select()
      .from(basketItemTable)
      .where(eq(basketItemTable.basketID, basketID));

    if (basketItems.length === 0) {
      throw new Error("Basket is empty");
    }

    // 2. Calculate total price
    const totalPizzasPrice = basketItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    const totalPrice = totalPizzasPrice + deliveryFee;

    // 3. Create order
    const orderID = crypto.randomUUID();
    const [rawOrder] = await this.#client
      .insert(this.#table)
      .values({
        id: orderID,
        basketID,
        userID,
        totalPrice: totalPrice.toFixed(2),
        deliveryOption: delivery,
        street: deliveryAddress?.street,
        number: deliveryAddress?.number,
        postalCode: deliveryAddress?.postalCode,
        town: deliveryAddress?.town,
        doorFloor: deliveryAddress?.doorFloor,
        customerNote,
        status: "Pending",
      } as IOrderInsert)
      .returning();

    // 4. Copy basket items to order_items
    const orderItemsData = basketItems.map((item) => ({
      orderID: rawOrder.id,
      pizzaID: item.pizzaID,
      quantity: item.quantity,
      price: item.price,
    }));

    await this.#client.insert(orderItemTable).values(orderItemsData);

    return this.normalizeOrder(rawOrder);
  }

  // Get order by ID
  async getById(orderID: string): Promise<IOrder | null> {
    const [rawOrder] = await this.#client
      .select()
      .from(this.#table)
      .where(eq(this.#table.id, orderID));
    return rawOrder ? this.normalizeOrder(rawOrder) : null;
  }

  // Get orders by user ID (admin use)
  async getByUser(userID: string): Promise<IOrder[]> {
    const rows = await this.#client
      .select()
      .from(this.#table)
      .where(eq(this.#table.userID, userID));
    return rows.map((r) => this.normalizeOrder(r));
  }

  // Get an order for a basket
  async getByBasket(basketID: string): Promise<IOrder[]> {
    const rows = await this.#client
      .select()
      .from(this.#table)
      .where(eq(this.#table.basketID, basketID));
    return rows.map((r) => this.normalizeOrder(r));
  }

  // Fetch a full order with all pizzas and quantities
  async getFullOrder(orderID: string): Promise<IFullOrder | null> {
    // 1. Get order info
    const [rawOrder] = await this.#client
      .select()
      .from(this.#table)
      .where(eq(this.#table.id, orderID));

    if (!rawOrder) return null;

    const order = this.normalizeOrder(rawOrder);

    // 2. Get order items with pizza info
    const itemsRaw = await this.#client
      .select({
        pizzaID: orderItemTable.pizzaID,
        name: pizzaTable.name,
        quantity: orderItemTable.quantity,
        price: orderItemTable.price,
      })
      .from(orderItemTable)
      .leftJoin(pizzaTable, eq(orderItemTable.pizzaID, pizzaTable.id))
      .where(eq(orderItemTable.orderID, orderID));

    // 3. Convert price strings to numbers if needed
    const items: IOrderItemQuery[] = itemsRaw.map((item) => ({
      pizzaID: item.pizzaID,
      name: item.name ?? "Unknown Pizza",
      quantity: item.quantity,
      price: Number(item.price),
    }));

    return { ...order, items };
  }
}

export { OrderHandler };
