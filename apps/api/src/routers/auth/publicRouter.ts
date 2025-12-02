import { createRouter } from "$routers/index";
import { loginValidator, signUpValidator } from "./validation";

const router = createRouter()
  .post("sign-up", signUpValidator, (c) => {
    return c.json({}, 500);
  })
  .post("login", loginValidator, (c) => {
    return c.json({}, 500);
  });

export default router;
