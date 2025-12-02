import { createRouter } from "./index";
import authRouter from "./auth/index";

const router = createRouter().route(authRouter.path, authRouter.publicRouter);

export default router;
