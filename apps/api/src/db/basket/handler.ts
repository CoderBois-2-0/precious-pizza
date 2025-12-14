import { TDB } from "..";
import { eq, and } from "drizzle-orm";
import { basketItemTable } from "../basketItem/schema";
import { pizzaTable } from "../pizza/schema";
import { IBasketItemInsert, IBasketItemQuery } from "../basketItem/types";
import { IBasketQuery, TBasketTable } from "./types";
import { basketTable } from "./schema";

class BasketHandler {
  readonly #client: TDB;
  readonly #table: TBasketTable;

  constructor(db: TDB) {
    this.#client = db;
    this.#table = basketTable;
  }

  // Create the basket
  async createBasket(): Promise<string> {
    const [row] = await this.#client
      .insert(this.#table)
      .values({
        totalPrice: "0.00",
      })
      .returning({ id: this.#table.id });

    if (!row) throw new Error("Failed to create basket");
    return row.id;
  }
  // Add one pizza to basket
  async addPizzaToBasket(pizza: IBasketItemInsert) {
    const { basketID, pizzaID, quantity, price } = pizza;
    // tx = transaction context (short for "transaction") --> this.#client inside transaction
    await this.#client.transaction(async (tx) => {
      // Check if the pizza already exists in this basket
      const [existing] = await tx
        .select({
          id: basketItemTable.id,
          quantity: basketItemTable.quantity,
        })
        .from(basketItemTable)
        .where(
          and(
            eq(basketItemTable.basketID, basketID),
            eq(basketItemTable.pizzaID, pizzaID),
          ),
        );

      if (existing) {
        // Increment quantity and update price to the latest value
        await tx
          .update(basketItemTable)
          .set({
            quantity: existing.quantity + quantity,
            price,
          })
          .where(eq(basketItemTable.id, existing.id));
      } else {
        await tx.insert(basketItemTable).values({
          basketID,
          pizzaID,
          quantity,
          price,
        });
      }

      // Recalculate total inside the same transaction so insert/update + total are atomic
      const items = await tx
        .select({
          quantity: basketItemTable.quantity,
          price: basketItemTable.price,
        })
        .from(basketItemTable)
        .where(eq(basketItemTable.basketID, basketID));

      const totalPrice = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );

      const formattedTotal = totalPrice.toFixed(2);
      const totalValue = Number(formattedTotal);

      // Validate NUMERIC(6,2) constraint: max 6 digits, 2 decimals (min 0.00 & max 9,999.99)
      if (totalValue >= 10000 || totalValue < 0) {
        throw new Error("Basket total cannot exceed 9,999.99 or be below 0.00");
      }

      await tx
        .update(this.#table)
        .set({ totalPrice: formattedTotal })
        .where(eq(this.#table.id, basketID));
    });
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
      .select({ createdAt: this.#table.createdAt })
      .from(this.#table)
      .where(eq(this.#table.id, basketID));

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
      .update(this.#table)
      .set({ totalPrice: totalPrice.toFixed(2) })
      .where(eq(this.#table.id, basketID));

    return totalPrice.toFixed(2);
  }

  // get all baskets with their items (admin use)
  async getAllBaskets(): Promise<IBasketQuery[]> {
    const basketIDs = await this.#client
      .select({ id: this.#table.id })
      .from(this.#table);

    if (basketIDs.length === 0) return [];

    const baskets = await Promise.all(
      basketIDs.map(({ id }) => this.getFullBasket(id)),
    );

    return baskets;
  }
}

export { BasketHandler };
