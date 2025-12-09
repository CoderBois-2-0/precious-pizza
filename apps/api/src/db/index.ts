import { drizzle } from "drizzle-orm/node-postgres";
import * as userSchema from "$db/user/schema";

function getDB(dbUrl: string, logger: boolean) {
  return drizzle(dbUrl, { logger, schema: { ...userSchema } });
}

type TDB = ReturnType<typeof getDB>;

export { getDB, TDB };
