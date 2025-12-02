import { jwt } from "hono/jwt";
import { authRouter } from "./auth/index";
import { createRouter, authTokenName } from "./util";

const router = createRouter()
  .use((c, next) => {
    const jwtHandler = jwt({
      secret: c.env.JWT_SECRET,
      cookie: authTokenName,
    });

    return jwtHandler(c, next);
  })
  .route(authRouter.path, authRouter.protectedRouter);

export default router;
