import { requireAdmin } from "$routers/middleware";
import { IEnv, TProtectedVariables } from "$routers/types";
import { createRouter } from "$routers/util";
import { IBasketVariables } from ".";
import { injectBasketHandler } from "./middleware";

interface IProtectedBasketVariables extends IBasketVariables, TProtectedVariables {}

interface IProtectedBasketEnv extends IEnv {
    Variables: IProtectedBasketVariables;
}

const router = createRouter<IProtectedBasketEnv>()
.use(requireAdmin)
.use(injectBasketHandler)
.get("/:id", basketV)