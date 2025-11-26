import { drizzle } from "drizzle-orm/node-postgres";

function getDB(dbUrl: string) {
  return drizzle(dbUrl, { schema: {} });
}

type TDB = ReturnType<typeof getDB>;

export { getDB, TDB };
