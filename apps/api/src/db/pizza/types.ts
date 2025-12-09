import { TCategory } from "$db/category/types";
import { pizzaTable } from "./schema";

type TPizzaTable = typeof pizzaTable;

type TPizza = typeof pizzaTable.$inferSelect;

type TPizzaInsert = Omit<typeof pizzaTable.$inferInsert, "id">;
type TPizzaUpdate = Partial<Omit<typeof pizzaTable.$inferInsert, "id">>;

interface IPizzaQuery {
  categoryID?: TCategory["id"];
  order?: {
    offset?: number;
    limit: number;
  };
}

export { TPizzaTable, TPizza, TPizzaInsert, TPizzaUpdate, IPizzaQuery };
