import { pgTable, numeric, timestamp, uuid } from "drizzle-orm/pg-core";

export const basketTable = pgTable("baskets", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  totalPrice: numeric("total_price", { precision: 6, scale: 2 }), // up to 6 digits, 2 after decimal
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
