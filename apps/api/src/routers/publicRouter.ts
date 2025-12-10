import { createRouter } from "./util";
import { authRouter } from "./auth/index";
import { pizzaRouter } from "./pizza";
import { categoryRouter } from "./category";
import { basketRouter } from "./basket";

const router = createRouter()
  .route(authRouter.path, authRouter.publicRouter)
  .route(categoryRouter.path, categoryRouter.publicRouter)
  .route(pizzaRouter.path, pizzaRouter.publicRouter)
  .route(basketRouter.path, basketRouter.publicRouter);

export default router;
