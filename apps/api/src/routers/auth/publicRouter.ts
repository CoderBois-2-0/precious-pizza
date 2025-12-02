import { TSafeUser } from "$db/user/types";
import { createRouter, setAuthCookie } from "$routers/util";
import { injectUserHandler } from "./middleware";
import { loginValidator, signUpValidator } from "./validation";

const router = createRouter()
  .use(injectUserHandler)
  .post("sign-up", signUpValidator, async (c) => {
    const userRequest = c.req.valid("json");
    const userHandler = c.get("userHandler");

    let user: TSafeUser;

    try {
      user = await userHandler.createCustomer({
        email: userRequest.email,
        firsName: userRequest["first-name"],
        lastName: userRequest["last-name"],
        password: userRequest.password,
      });
    } catch {
      return c.json({ message: "Could not create user" }, 500);
    }

    await setAuthCookie(c, user);

    return c.json({ message: "User created" }, 201);
  })
  .post("login", loginValidator, async (c) => {
    const userRequest = c.req.valid("json");
    const userHandler = c.get("userHandler");

    let user: TSafeUser | undefined = undefined;

    try {
      user = await userHandler.findUser(
        userRequest.email,
        userRequest.password,
      );
    } catch {
      return c.json({ message: "DB error" }, 500);
    }
    if (!user) {
      return c.json({ message: "Could not find user" }, 404);
    }

    await setAuthCookie(c, user);

    return c.json(user, 200);
  });

export default router;
