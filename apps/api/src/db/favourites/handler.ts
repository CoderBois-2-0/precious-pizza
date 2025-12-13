import { TDB } from "$db/index";
import { IFavourite, IFavouriteWithPizza, INewFavourite } from "./types";
import { favouritesTable } from "./schema";
import { eq } from "drizzle-orm";

class FavouritesHandler {
  #client: TDB;

  // Accept a pre-initialized db client (transaction-safe)
  constructor(db: TDB) {
    this.#client = db;
  }

  // Get all favourites for a user
  async getAll(query: Partial<IFavourite>): Promise<IFavouriteWithPizza[]> {
    const userId = query.userId;
    if (!userId) return [];

    return await this.#client.query.favouritesTable.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
      with: {
        pizza: {
          columns: { name: true },
        },
      },
    });
  }

  // Flexible find with optional filters
  async find(query: Partial<IFavourite>): Promise<IFavourite[]> {
    let qb = this.#client.select().from(favouritesTable).$dynamic();

    if (query.id !== undefined) {
      qb = qb.where(eq(favouritesTable.id, query.id));
    }
    if (query.userId !== undefined) {
      qb = qb.where(eq(favouritesTable.userId, query.userId));
    }
    if (query.pizzaId !== undefined) {
      qb = qb.where(eq(favouritesTable.pizzaId, query.pizzaId));
    }

    return await qb.execute();
  }

  // Add a new favourite
  async create(input: INewFavourite): Promise<IFavourite[]> {
    if (!input.userId || !input.pizzaId) {
      throw new Error("Missing userId or pizzaId");
    }

    return await this.#client
      .insert(favouritesTable)
      .values(input)
      .onConflictDoNothing({
        target: [favouritesTable.userId, favouritesTable.pizzaId],
      })
      .returning();
  }

  // Remove a favourite
  async delete(favouriteID: string): Promise<void> {
    await this.#client
      .delete(favouritesTable)
      .where(eq(favouritesTable.id, favouriteID));
  }
}

export { FavouritesHandler };
