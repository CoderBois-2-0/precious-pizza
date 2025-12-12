import { basketItemTable } from "./schema";

type IBasketItem = typeof basketItemTable.$inferSelect;
type IBasketItemInsert = typeof basketItemTable.$inferInsert;

interface IBasketItemQuery {
  id?: number;
  pizzaID: string;
  name: string;
  quantity: number;
  price: number;
}

export { IBasketItem, IBasketItemInsert, IBasketItemQuery };
