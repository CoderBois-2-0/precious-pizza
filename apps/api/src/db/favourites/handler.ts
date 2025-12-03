import { getDB, TDB } from "$db/index";
import { IFavourite, INewFavourite } from "./types";
import { favouritesTable } from "./schema";
import { and, eq } from "drizzle-orm";

class FavouritesHandler {
  #client: TDB;

  constructor(dbUrl: string) {
    const db = getDB(dbUrl);
    this.#client = db;
  }

  // Get all favourites for a user
  async getAllByUser(userId: string): Promise<IFavourite[]> {
    return await this.#client.query.favouritesTable.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
    });
  }

  // Flexible find with optional filters
  async find(query: Partial<IFavourite>): Promise<IFavourite[]> {
    return await this.#client.query.favouritesTable.findMany({
      where: (fields, { eq, and }) => {
        const clauses: any[] = [];

        if (query.id !== undefined) clauses.push(eq(fields.id, query.id));
        if (query.userId !== undefined) clauses.push(eq(fields.userId, query.userId));
        if (query.pizzaId !== undefined) clauses.push(eq(fields.pizzaId, query.pizzaId));

        if (clauses.length === 0) return undefined;
        return clauses.length === 1 ? clauses[0] : and(...clauses);
      },
    });
  }

  // Add a new favourite
  async addFavourite(input: INewFavourite): Promise<IFavourite[]> {
    return await this.#client
      .insert(favouritesTable)
      .values(input)
      .returning();
  }

  // Remove a favourite
  async removeFavourite(userId: string, pizzaId: string): Promise<void> {
    await this.#client
      .delete(favouritesTable)
      .where(
        and(
          eq(favouritesTable.userId, userId),
          eq(favouritesTable.pizzaId, pizzaId)
        )
      );
  }
}

export { FavouritesHandler };
