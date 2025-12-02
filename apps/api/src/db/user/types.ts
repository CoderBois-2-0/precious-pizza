import { userTable } from "./schema";

type TUserTable = typeof userTable;

type TUser = typeof userTable.$inferSelect;
type TSafeUser = Omit<TUser, "password">;
type TUserInsert = Omit<typeof userTable.$inferInsert, "id" | "role">;

export { TUserTable, TUser, TSafeUser, TUserInsert };
