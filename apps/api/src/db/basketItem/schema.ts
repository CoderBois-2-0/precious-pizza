import { pgTable, varchar, numeric, integer, serial, foreignKey } from "drizzle-orm/pg-core";
import { pizzaTable } from "../pizza/schema";
import { basketTable } from "../basket/schema";

export const basketItemTable = pgTable(
  "basket_items",
  {
    id: serial("id").primaryKey(),
    pizzaID: integer("pizza_id")
      .references(() => pizzaTable.id)
      .notNull(),
    basketID: varchar("basket_id", { length: 36 })
      .references(() => basketTable.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 6, scale: 2 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.pizzaID],
      foreignColumns: [pizzaTable.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.basketID],
      foreignColumns: [basketTable.id],
    }).onDelete("cascade"),
  ]
);
