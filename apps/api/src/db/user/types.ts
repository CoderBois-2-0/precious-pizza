import { userTable } from "./schema";

type TUserTable = typeof userTable;

type TUser = Omit<typeof userTable.$inferSelect, "password">;
type TUserInsert = Omit<typeof userTable.$inferInsert, "id" | "role">;

export { TUserTable, TUser, TUserInsert };
