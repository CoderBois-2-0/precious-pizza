import {
  pgEnum,
  pgTable,
  primaryKey,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

const userRole = pgEnum("user_role", ["admin", "customer"]);

const userTable = pgTable(
  "users",
  {
    id: uuid("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email", { length: 254 }).notNull().unique(),
    firsName: varchar("first_name", { length: 40 }).notNull(),
    lastName: varchar("last_name", { length: 80 }).notNull(),
    password: text("password").notNull(),
    role: userRole("role").notNull(),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);

export { userTable, userRole };
