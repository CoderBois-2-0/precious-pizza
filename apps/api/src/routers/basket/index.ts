import { BasketHandler } from "../../db/basket/handler";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";

interface IBasketVariables {
  basketHandler: BasketHandler;
}

const basketRouter = {
  path: "/basket" as const,
  publicRouter,
  protectedRouter,
};

export { basketRouter, IBasketVariables };
