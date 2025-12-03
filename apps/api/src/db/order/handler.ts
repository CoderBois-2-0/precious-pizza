import { eq } from "drizzle-orm";
import { orderTable } from "./schema";
import { pizzaInBasketTable } from "../pizzaInBasket/schema";
import { orderItemTable } from "../orderItem/schema";
import { getDB, TDB } from "..";
import { pizzaTable } from "../pizza/schema";



interface INewOrder {
  basketID: string;
  delivery: "Pickup" | "Delivery";
  deliveryFee?: number;
  deliveryAddress?: {
    street: string;
    number: string;
    postalCode: string;
    town: string;
    doorFloor?: string;
  };
  customerNote?: string;
}

interface IOrder {
  id: string;
  basketID: string;
  totalPrice: number;
  deliveryOption: string;
  street?: string;
  number?: string;
  postalCode?: string;
  town?: string;
  doorFloor?: string;
  customerNote?: string;
  status: string;
  createdAt: Date;
}

interface IOrderItem {
  pizzaID: number;
  name: string;
  quantity: number;
  price: number;
}

interface IFullOrder extends IOrder {
  items: IOrderItem[];
}

class OrdersHandler {
  #client: TDB;

  constructor(dbUrl: string) {
    const db = getDB(dbUrl);
    this.#client = db;
  }

  private normalizeOrder(raw: any): IOrder {
    return {
      ...raw,
      totalPrice: Number(raw.totalPrice),
    } as IOrder;
  }

  // Create a new order from a basket
  async createOrder(input: INewOrder): Promise<IOrder> {
    const { basketID, delivery, deliveryFee = 0, deliveryAddress, customerNote } = input;

    // 1. Fetch basket items
    const basketItems = await this.#client.select().from(pizzaInBasketTable).where(eq(pizzaInBasketTable.basketID, basketID));

    if (basketItems.length === 0) {
      throw new Error("Basket is empty");
    }

    // 2. Calculate total price
    const totalPizzasPrice = basketItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const totalPrice = totalPizzasPrice + deliveryFee;

    // 3. Create order
    const orderID = crypto.randomUUID();
    const [rawOrder] = await this.#client
      .insert(orderTable)
      .values({
        id: orderID,
        basketID,
        totalPrice: String(totalPrice),
        deliveryOption: delivery,
        street: deliveryAddress?.street,
        number: deliveryAddress?.number,
        postalCode: deliveryAddress?.postalCode,
        town: deliveryAddress?.town,
        doorFloor: deliveryAddress?.doorFloor,
        customerNote,
        status: "Pending",
      })
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
    const [rawOrder] = await this.#client.select().from(orderTable).where(eq(orderTable.id, orderID));
    return rawOrder ? this.normalizeOrder(rawOrder) : null;
  }

  // Get an order for a basket
  async getByBasket(basketID: string): Promise<IOrder[]> {
    const rows = await this.#client.select().from(orderTable).where(eq(orderTable.basketID, basketID));
    return rows.map((r) => this.normalizeOrder(r));
  }

  // Fetch a full order with all pizzas and quantities
  async getFullOrder(orderID: string): Promise<IFullOrder | null> {
    // 1. Get order info
    const [rawOrder] = await this.#client.select().from(orderTable).where(eq(orderTable.id, orderID));

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
    const items: IOrderItem[] = itemsRaw.map((item) => ({
      pizzaID: item.pizzaID,
      name: item.name ?? "Unknown Pizza",
      quantity: item.quantity,
      price: Number(item.price),
    }));

    return { ...order, items };
  }
}

export { OrdersHandler, INewOrder, IOrder };
