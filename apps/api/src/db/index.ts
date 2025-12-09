import { drizzle } from "drizzle-orm/node-postgres";
import * as userSchema from "$db/user/schema";
import * as categorySchema from "$db/category/schema";
import * as pizzaSchema from "$db/pizza/schema";
import * as favouriteSchema from "$db/favourites/schema";

function getDB(dbUrl: string, logger: boolean) {
  return drizzle(dbUrl, {
    logger,
    schema: {
      ...userSchema,
      ...categorySchema,
      ...pizzaSchema,
      ...favouriteSchema,
    },
  });
}

type TDB = ReturnType<typeof getDB>;

export { getDB, TDB };
