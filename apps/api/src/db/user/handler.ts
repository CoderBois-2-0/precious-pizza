import { getDB, TDB } from "$db/index";
import { userTable } from "./schema";
import { TUser, TUserInsert, TUserTable } from "./types";

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
  ): Promise<TUser> {}

  /**
   * @description
   * createCustomer will create a customer with the "customer" role
   */
  async createCustomer(newUser: TUserInsert): Promise<void> {}
}

export default UserHandler;
