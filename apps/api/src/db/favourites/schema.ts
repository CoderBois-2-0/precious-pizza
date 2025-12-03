import { varchar, pgTable } from "drizzle-orm/pg-core";

const favouritesTable = pgTable("favourites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  pizzaId: varchar("pizza_id", { length: 36 }).notNull()
});

export {favouritesTable};