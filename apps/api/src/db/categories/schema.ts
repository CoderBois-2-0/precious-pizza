import { pgEnum } from "drizzle-orm/pg-core";

export const pizzaCategory = pgEnum("pizza_categories", [
  "Italian",
  "Mexican",
  "Special",
  "Folded",
]);
