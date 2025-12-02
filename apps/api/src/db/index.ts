import { drizzle } from "drizzle-orm/node-postgres";
import * as userSchema from "$db/user/schema";

function getDB(dbUrl: string) {
  return drizzle(dbUrl, { schema: { ...userSchema } });
}

type TDB = ReturnType<typeof getDB>;

export { getDB, TDB };
