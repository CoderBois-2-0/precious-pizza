import { pgTable, numeric, varchar } from "drizzle-orm/pg-core";

export const basketTable = pgTable("baskets", {
  id: varchar("id", { length: 36 }).primaryKey(),
  totalPrice: numeric("total_price", { precision: 6, scale: 2 }), // up to 6 digits, 2 after decimal
});
