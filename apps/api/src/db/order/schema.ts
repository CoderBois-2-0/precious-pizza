import {
  pgTable,
  varchar,
  numeric,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { basketTable } from "../basket/schema";

export const deliveryOption = pgEnum("delivery_option", ["Pickup", "Delivery"]);

export const orderStatus = pgEnum("order_status", [
  "Pending",
  "Cancelled",
  "Successful",
]);

export const orderTable = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  basketID: varchar("basket_id", { length: 36 })
    .references(() => basketTable.id)
    .notNull(),
  totalPrice: numeric("total_price", { precision: 8, scale: 2 }).notNull(),
  deliveryOption: deliveryOption("delivery_option").notNull(),

  street: varchar("street", { length: 100 }),
  number: varchar("number", { length: 20 }),
  postalCode: varchar("postal_code", { length: 20 }),
  town: varchar("town", { length: 50 }),
  doorFloor: varchar("door_floor", { length: 50 }),

  customerNote: varchar("customer_note", { length: 500 }),
  status: orderStatus("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
