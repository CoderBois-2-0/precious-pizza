import {
  pgTable,
  varchar,
  numeric,
  pgEnum,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { basketTable } from "../basket/schema";
import { userTable } from "../user/schema";

export const deliveryOption = pgEnum("delivery_option", ["Pickup", "Delivery"]);

export const orderStatus = pgEnum("order_status", [
  "Pending",
  "Cancelled",
  "Successful",
]);

export const orderTable = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  basketID: uuid("basket_id")
    .references(() => basketTable.id)
    .notNull(),
  userID: uuid("user_id").references(() => userTable.id),
  totalPrice: numeric("total_price", { precision: 6, scale: 2 }).notNull(),
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
