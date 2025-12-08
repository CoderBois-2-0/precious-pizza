import { getDB, TDB } from "$db/index";
import { eq } from "drizzle-orm";
import { pizzaTable } from "./schema";
import { TPizza, TPizzaInsert, TPizzaTable, TPizzaUpdate } from "./types";

class PizzaHandler {
  #client: TDB;
  #table: TPizzaTable;

  constructor(dbUrl: string, logger: boolean) {
    this.#client = getDB(dbUrl, logger);
    this.#table = pizzaTable;
  }

  async getAll(): Promise<TPizza[]> {
    return await this.#client.select().from(this.#table);
  }

  async create(newPizza: TPizzaInsert): Promise<void> {
    await this.#client.insert(this.#table).values(newPizza);
  }

  async update(
    pizzaID: TPizza["id"],
    pizzaUpdate: TPizzaUpdate,
  ): Promise<void> {
    await this.#client
      .update(this.#table)
      .set(pizzaUpdate)
      .where(eq(this.#table.id, pizzaID));
  }

  async delete(pizzaID: TPizza["id"]): Promise<void> {
    await this.#client.delete(this.#table).where(eq(this.#table.id, pizzaID));
  }
}

export default PizzaHandler;
