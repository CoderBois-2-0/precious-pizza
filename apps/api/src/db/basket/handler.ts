import { getDB, TDB } from "..";
import { eq, and } from "drizzle-orm";
import { basketItemTable } from "../basketItem/schema";
import { pizzaTable } from "../pizza/schema";
import { IBasketItemInsert, IBasketItemQuery } from "../basketItem/types";
import { IBasketQuery, TBasketTable } from "./types";
import { basketTable } from "./schema";

class BasketHandler {
  #client: TDB;
  #table: TBasketTable;

  constructor(dbUrl: string, logger: boolean) {
    this.#client = getDB(dbUrl, logger);
    this.#table = basketTable;
  }

  // Create the basket
  async createBasket(): Promise<string> {
    const [row] = await this.#client
      .insert(basketTable)
      .values({
        totalPrice: "0.00",
      })
      .returning({ id: basketTable.id });

    if (!row) throw new Error("Failed to create basket");
    return row.id;
  }
  // Add one pizza to basket
  async addPizzaToBasket(input: IBasketItemInsert) {
    const { basketID, pizzaID, quantity, price } = input;

    await this.#client.insert(basketItemTable).values({
      basketID,
      pizzaID,
      quantity,
      price,
    });

    await this.updateBasketTotal(basketID);
  }

  async removePizzaFromBasket(basketID: string, pizzaInBasketID: number) {
    await this.#client
      .delete(basketItemTable)
      .where(
        and(
          eq(basketItemTable.id, pizzaInBasketID),
          eq(basketItemTable.basketID, basketID),
        ),
      );

    await this.updateBasketTotal(basketID);
  }

  // get basket items with pizza info
  async getBasketItems(basketID: string): Promise<IBasketItemQuery[]> {
    const rows = await this.#client
      .select({
        id: basketItemTable.id,
        pizzaID: basketItemTable.pizzaID,
        name: pizzaTable.name,
        quantity: basketItemTable.quantity,
        price: basketItemTable.price,
      })
      .from(basketItemTable)
      .leftJoin(pizzaTable, eq(basketItemTable.pizzaID, pizzaTable.id))
      .where(eq(basketItemTable.basketID, basketID));

    return rows.map((row) => ({
      id: row.id,
      pizzaID: row.pizzaID,
      name: row.name ?? "Unknown Pizza",
      quantity: row.quantity,
      price: Number(row.price),
    }));
  }

  // get full basket with total price
  async getFullBasket(basketID: string): Promise<IBasketQuery> {
    // Load basket metadata
    const [basketMeta] = await this.#client
      .select({ createdAt: basketTable.createdAt })
      .from(basketTable)
      .where(eq(basketTable.id, basketID));

    if (!basketMeta) {
      throw new Error("Basket not found");
    }

    // Load items with pizza info
    const items = await this.getBasketItems(basketID);

    //  Calculate total price dynamically
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      id: basketID,
      totalPrice: totalPrice.toFixed(2),
      createdAt: basketMeta.createdAt,
      items,
    };
  }

  // recompute and persist basket total
  async updateBasketTotal(basketID: string): Promise<string> {
    const items = await this.getBasketItems(basketID);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await this.#client
      .update(basketTable)
      .set({ totalPrice: totalPrice.toFixed(2) })
      .where(eq(basketTable.id, basketID));

    return totalPrice.toFixed(2);
  }

  // get all baskets with their items (admin use)
  async getAllBaskets(): Promise<IBasketQuery[]> {
    const basketIDs = await this.#client
      .select({ id: basketTable.id })
      .from(basketTable);

    if (basketIDs.length === 0) return [];

    const baskets = await Promise.all(
      basketIDs.map(({ id }) => this.getFullBasket(id)),
    );

    return baskets;
  }
}

export { BasketHandler };
