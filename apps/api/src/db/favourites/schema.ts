import { pizzaTable } from "$db/pizza/schema";
import { relations } from "drizzle-orm";
import { uuid, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

const favouritesTable = pgTable(
  "favourites",
  {
    id: uuid("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: uuid("user_id").notNull(),
    pizzaId: uuid("pizza_id").notNull(),
  },
  (table) => ({
    userPizzaUnique: uniqueIndex("favourites_user_pizza_unique").on(
      table.userId,
      table.pizzaId,
    ),
  }),
);

const favouritesRelation = relations(favouritesTable, ({ one }) => ({
  pizza: one(pizzaTable, {
    fields: [favouritesTable.pizzaId],
    references: [pizzaTable.id],
  }),
}));

export { favouritesTable, favouritesRelation };
