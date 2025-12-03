import {
  pgTable,
  varchar,
  numeric,
  serial,
  boolean,
} from "drizzle-orm/pg-core";
import { pizzaCategory } from "../categories/schema";

export const pizzaTable = pgTable("pizzas", {
  id: serial("id").primaryKey(), // auto-increment id
  name: varchar("name", { length: 50 }).notNull(),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  category: pizzaCategory("category").notNull(),
  imageUrl: varchar("image_url", { length: 200 }),
  isVisible: boolean("is_visible").notNull(),
});
