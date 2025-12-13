import { TDB } from "$db/index";
import { eq } from "drizzle-orm";
import { pizzaTable } from "./schema";
import {
  IPizzaQuery,
  TPizza,
  TPizzaInsert,
  TPizzaTable,
  TPizzaUpdate,
} from "./types";

class PizzaHandler {
  #client: TDB;
  #table: TPizzaTable;

  constructor(db: TDB) {
    this.#client = db;
    this.#table = pizzaTable;
  }

  async getAll(query?: IPizzaQuery): Promise<TPizza[]> {
    let qb = this.#client.select().from(this.#table).$dynamic();

    if (query?.categoryID) {
      qb = qb.where(eq(this.#table.categoryID, query.categoryID));
    }

    const order = query?.order;
    if (order?.offset) {
      qb = qb.offset(order.offset);
    }
    if (order?.limit) {
      qb = qb.limit(order.limit);
    }

    return await qb.execute();
  }

  async create(newPizza: TPizzaInsert): Promise<void> {
    //validate name length is not less than 1
    if (!newPizza.name || newPizza.name.trim().length < 1) {
      throw new Error("Name must be at least 1 character");
    }

    await this.#client.insert(this.#table).values(newPizza);
  }

  async update(
    pizzaID: TPizza["id"],
    pizzaUpdate: TPizzaUpdate
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
