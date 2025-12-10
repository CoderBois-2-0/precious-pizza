import { getDB, TDB } from "$db/index";
import { IFavourite, IFavouriteWithPizza, INewFavourite } from "./types";
import { favouritesTable } from "./schema";
import { and, eq } from "drizzle-orm";

class FavouritesHandler {
  #client: TDB;

  constructor(dbUrl: string, logger: boolean) {
    const db = getDB(dbUrl, logger);
    this.#client = db;
  }

  // Get all favourites for a user
  async getAllByUser(userId: string): Promise<IFavouriteWithPizza[]> {
    return await this.#client.query.favouritesTable.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
      with: {
        pizza: {
          columns: {
            name: true,
          },
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
  async addFavourite(input: INewFavourite): Promise<IFavourite[]> {
    return await this.#client.insert(favouritesTable).values(input).returning();
  }

  // Remove a favourite
  async removeFavourite(userId: string, pizzaId: string): Promise<void> {
    await this.#client
      .delete(favouritesTable)
      .where(
        and(
          eq(favouritesTable.userId, userId),
          eq(favouritesTable.pizzaId, pizzaId),
        ),
      );
  }
}

export { FavouritesHandler };
