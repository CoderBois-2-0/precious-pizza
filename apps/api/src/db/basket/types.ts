import { IBasketItemQuery } from "../basketItem/types";
import { basketTable } from "./schema";

type IBasket = typeof basketTable.$inferSelect;
type IBasketInsert = typeof basketTable.$inferInsert;

interface IFullBasket extends IBasket {
  items: IBasketItemQuery[];
  totalPrice: string;
}

export { IBasket, IBasketInsert, IFullBasket };
