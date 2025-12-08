import { pizzaTable } from "./schema";

type TPizzaTable = typeof pizzaTable;

type TPizza = typeof pizzaTable.$inferSelect;

type TPizzaInsert = Omit<typeof pizzaTable.$inferInsert, "id">;
type TPizzaUpdate = Partial<Omit<typeof pizzaTable.$inferInsert, "id">>;

export { TPizzaTable, TPizza, TPizzaInsert, TPizzaUpdate };
