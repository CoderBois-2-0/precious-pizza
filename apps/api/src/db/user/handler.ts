import { sql } from "drizzle-orm";

import { getDB, TDB } from "$db/index";
import { userTable } from "./schema";
import { TSafeUser, TUser, TUserInsert, TUserTable } from "./types";

class UserHandler {
  #client: TDB;
  #table: TUserTable;

  constructor(dbUrl: string) {
    this.#client = getDB(dbUrl);
    this.#table = userTable;
  }

  /**
   * @description
   * findUser attempts to find a user using their email and password
   */
  async findUser(
    userEmail: TUser["email"],
    userPassword: TUser["password"],
  ): Promise<TSafeUser | undefined> {
    const user = await this.#client.query.userTable.findFirst({
      where: (user, { eq, and }) =>
        and(
          eq(user.email, userEmail),
          sql`crypt(${userPassword}, ${user.password})`,
        ),
    });

    if (!user) {
      return user;
    }

    // disabling eslint on password as it needs to be discarding for security
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { password: _, ...safeUser } = user;

    return safeUser;
  }

  /**
   * @description
   * createCustomer will create a customer with the "customer" role
   */
  async createCustomer(newUser: TUserInsert): Promise<void> {
    await this.#client.insert(this.#table).values({
      ...newUser,
      role: "customer",
      password: sql`crypt(${newUser.password}, gen_salt('bf', 12))`,
    });
  }
}

export default UserHandler;
