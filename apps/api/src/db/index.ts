import { drizzle } from "drizzle-orm/node-postgres";
import * as favouritesSchema from "./favourites/schema";

function getDB(dbUrl: string) {
  return drizzle(dbUrl, { schema: {
    ...favouritesSchema,
  } });
}

type TDB = ReturnType<typeof getDB>;

export { getDB, TDB };
