import { pizzaTable } from "$db/pizza/schema";
import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const categoryTable = pgTable("categories", {
  id: uuid("id")
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 40 }).notNull(),
});

const categoryRelation = relations(categoryTable, ({ many }) => ({
  pizzas: many(pizzaTable),
}));

export { categoryTable, categoryRelation };
