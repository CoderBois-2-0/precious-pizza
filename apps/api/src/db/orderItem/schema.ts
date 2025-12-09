import {
  pgTable,
  varchar,
  serial,
  numeric,
  uuid,
  foreignKey,
} from "drizzle-orm/pg-core";
import { pizzaTable } from "../pizza/schema";
import { orderTable } from "../order/schema";

export const orderItemTable = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderID: varchar("order_id", { length: 36 })
      .references(() => orderTable.id)
      .notNull(),
    pizzaID: uuid("pizza_id")
      .references(() => pizzaTable.id)
      .notNull(),
    price: numeric("price", { precision: 6, scale: 2 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderID],
      foreignColumns: [orderTable.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.pizzaID],
      foreignColumns: [pizzaTable.id],
    }).onDelete("cascade"),
  ],
);
