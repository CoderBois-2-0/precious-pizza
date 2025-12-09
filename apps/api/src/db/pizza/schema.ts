import { categoryTable } from "$db/category/schema";
import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  primaryKey,
  real,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const pizzaTable = pgTable(
  "pizzas",
  {
    id: uuid("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 40 }).notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    price: real("price").notNull(),
    isDraft: boolean("is_draft").notNull().default(false),
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
