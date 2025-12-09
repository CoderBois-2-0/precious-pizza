import { getDB, TDB } from "$db/index";
import { eq } from "drizzle-orm";
import { categoryTable } from "./schema";
import {
  TCategory,
  TCategoryInsert,
  TCategoryTable,
  TCategoryUpdate,
} from "./types";

class CategoryHandler {
  #client: TDB;
  #table: TCategoryTable;

  constructor(dbUrl: string, logger: boolean) {
    this.#client = getDB(dbUrl, logger);
    this.#table = categoryTable;
  }

  async getAll(): Promise<TCategory[]> {
    return await this.#client.query.categoryTable.findMany();
  }

  async create(newCategory: TCategoryInsert): Promise<void> {
    await this.#client.insert(this.#table).values(newCategory);
  }

  async update(
    categoryID: TCategory["id"],
    categoryUpdate: TCategoryUpdate,
  ): Promise<void> {
    await this.#client
      .update(this.#table)
      .set(categoryUpdate)
      .where(eq(categoryTable.id, categoryID));
  }

  async delete(categoryID: TCategory["id"]): Promise<void> {
    await this.#client
      .delete(this.#table)
      .where(eq(this.#table.id, categoryID));
  }
}

export default CategoryHandler;
