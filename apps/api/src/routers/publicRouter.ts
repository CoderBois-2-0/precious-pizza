import { createRouter } from "./util";
import { authRouter } from "./auth/index";
import { pizzaRouter } from "./pizza";
import { categoryRouter } from "./category";
import { basketRouter } from "./basket";
import { orderRouter } from "./order";
import { lotrRouter } from "./lotr";

const router = createRouter()
  .route(authRouter.path, authRouter.publicRouter)
  .route(categoryRouter.path, categoryRouter.publicRouter)
  .route(pizzaRouter.path, pizzaRouter.publicRouter)
  .route(basketRouter.path, basketRouter.publicRouter)
  .route(orderRouter.path, orderRouter.publicRouter)
  .route(lotrRouter.path, lotrRouter.publicRouter);

export default router;
