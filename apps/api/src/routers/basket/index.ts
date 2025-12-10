

import { createRouter } from "$routers/util";
import { BasketHandler } from "../../db/basket/handler";
import { IBasketQuery } from "../../db/basket/types";
import { IBasketItemInsert, IBasketItemQuery } from "../../db/basketItem/types";

interface IBasketVariables {
  basketHandler: BasketHandler;
}

const basketRouter = {
  path: "/basket" as const,
  publicRouter,
  protectedRouter,
};

export { basketRouter, IBasketVariables };


