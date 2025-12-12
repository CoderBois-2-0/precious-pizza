import { IBasketItemQuery } from "../basketItem/types";
import { basketTable } from "./schema";

type TBasketTable = typeof basketTable;

type TBasket = typeof basketTable.$inferSelect;
type TBasketInsert = typeof basketTable.$inferInsert;

interface IBasketQuery extends TBasket {
  items: IBasketItemQuery[];
  totalPrice: string;
}

export { TBasket, TBasketInsert, IBasketQuery, TBasketTable };
