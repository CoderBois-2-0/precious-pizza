import { connectDB, TDB } from "$db/index";
import { IFavourite, INewFavourite } from "./types";
import { favouritesTable } from "./schema";

class FavouritesHandler {
  #client: TDB;

  constructor(dbUrl: string) {
    const db = connectDB(dbUrl);
    this.#client = db;
  }

  async getAllByUser(userId: number): Promise<IFavourite[]> {
    return await this.#client.query.favourites.findMany({
      where: (favs: typeof favouritesTable, { eq }: any) => eq(favs.userId, userId),
    });
  }

  async find(query: Partial<IFavourite>): Promise<IFavourite[]> {
    return await this.#client.query.favourites.findMany({
      where: (favs: typeof favouritesTable, { eq, and }: any) => {
        const clauses: any[] = [];
        if (query.id !== undefined) clauses.push(eq(favs.id, query.id));
        if (query.userId !== undefined) clauses.push(eq(favs.userId, query.userId));
        if (query.pizzaId !== undefined) clauses.push(eq(favs.pizzaId, query.pizzaId));
        if (clauses.length === 0) return undefined;
        return clauses.length === 1 ? clauses[0] : and(...clauses);
      },
    });
  }

  async addFavourite(input: INewFavourite): Promise<IFavourite[]> {
    return await this.#client
      .insert(this.#client.schema.favourites)
      .values(input)
      .returning();
  }

  async removeFavourite(userId: number, pizzaId: number): Promise<void> {
    await this.#client
      .delete(this.#client.schema.favourites)
      .where((favs: typeof favouritesTable, { and, eq }: any) =>
        and(eq(favs.userId, userId), eq(favs.pizzaId, pizzaId))
      );
  }
}

export { FavouritesHandler };
