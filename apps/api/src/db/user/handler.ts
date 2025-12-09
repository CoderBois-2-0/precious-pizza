import { getTableColumns, sql } from "drizzle-orm";

import { getDB, TDB } from "$db/index";
import { userTable } from "./schema";
import { TSafeUser, TUser, TUserInsert, TUserTable } from "./types";

class UserHandler {
  readonly #client: TDB;
  readonly #table: TUserTable;

  constructor(dbUrl: string, logger: boolean) {
    this.#client = getDB(dbUrl, logger);
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
          sql`${userTable.password} = crypt(${userPassword}, ${user.password})`,
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
  async createCustomer(newUser: TUserInsert): Promise<TSafeUser> {
    const userRows = await this.#client
      .insert(this.#table)
      .values({
        ...newUser,
        role: "customer",
        password: sql`crypt(${newUser.password}, gen_salt('bf', 12))`,
      })
      .returning(this.getSafeColumns());

    const user = userRows.at(0);
    if (!user) {
      throw new Error("DB returned no rows upon insert");
    }

    return user;
  }

  getSafeColumns() {
    const unsafeColumns = getTableColumns(this.#table);
    // disabling eslint on password as it needs to be discarding for security
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { password: _, ...safeColumns } = unsafeColumns;

    return safeColumns;
  }
}

export default UserHandler;
