import { categoryTable } from "$db/category/schema";
import { relations } from "drizzle-orm";
import {
  numeric,
  boolean,
  foreignKey,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const pizzaTable = pgTable(
  "pizzas",
  {
    id: uuid("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 50 }).notNull(),
    price: numeric("price", { precision: 6, scale: 2 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    imageUrl: varchar("image_url", { length: 200 }),
    isVisible: boolean("is_visible").notNull(),
    categoryID: uuid("category_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id] }),
    foreignKey({
      columns: [table.categoryID],
      foreignColumns: [categoryTable.id],
    }),
  ],
);

const pizzaRelation = relations(pizzaTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [pizzaTable.categoryID],
    references: [categoryTable.id],
  }),
}));

export { pizzaTable, pizzaRelation };
