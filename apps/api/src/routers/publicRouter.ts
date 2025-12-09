import { createRouter } from "./util";
import { authRouter } from "./auth/index";
import { pizzaRouter } from "./pizza";

const router = createRouter()
  .route(authRouter.path, authRouter.publicRouter)
  .route(pizzaRouter.path, pizzaRouter.publicRouter);

export default router;
