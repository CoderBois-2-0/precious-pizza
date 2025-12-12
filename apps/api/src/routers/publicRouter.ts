import { createRouter } from "./util";
import { authRouter } from "./auth/index";
import { pizzaRouter } from "./pizza";
import { lotrRouter } from "./lotr";

const router = createRouter()
  .route(authRouter.path, authRouter.publicRouter)
  .route(pizzaRouter.path, pizzaRouter.publicRouter)
  .route(lotrRouter.path, lotrRouter.publicRouter);

export default router;
