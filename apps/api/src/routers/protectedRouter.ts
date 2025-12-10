import { jwt } from "hono/jwt";
import { authRouter } from "./auth/index";
import { categoryRouter } from "./category";
import { pizzaRouter } from "./pizza";
import { createRouter, authTokenName } from "./util";
import favourtiesRouter from "./favourites/index";

const router = createRouter()
  .use((c, next) => {
    const jwtHandler = jwt({
      secret: c.env.JWT_SECRET,
      cookie: authTokenName,
    });

    return jwtHandler(c, next);
  })
  .route(authRouter.path, authRouter.protectedRouter)
  .route(categoryRouter.path, categoryRouter.protectedRouter)
  .route(pizzaRouter.path, pizzaRouter.protectedRouter)
  .route("/favourite", favourtiesRouter);

export default router;
