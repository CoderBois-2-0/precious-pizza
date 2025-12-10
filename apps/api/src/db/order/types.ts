import { orderItemTable } from "../orderItem/schema";
import { orderTable } from "./schema";

type TOrderTable = typeof orderTable;

type IOrder = typeof orderTable.$inferSelect;
type IOrderInsert = typeof orderTable.$inferInsert;

type IOrderItem = typeof orderItemTable.$inferSelect;
type IOrderItemInsert = typeof orderItemTable.$inferInsert;

interface IOrderItemQuery {
  pizzaID: string;
  name: string;
  quantity: number;
  price: number;
}

interface IFullOrder extends IOrder {
  items: IOrderItemQuery[];
}

interface INewOrder {
  basketID: string;
  delivery: "Pickup" | "Delivery";
  deliveryFee?: number;
  deliveryAddress?: {
    street: string;
    number: string;
    postalCode: string;
    town: string;
    doorFloor?: string;
  };
  customerNote?: string;
}

export { INewOrder, IFullOrder, IOrder, IOrderItem, IOrderItemQuery, IOrderInsert, IOrderItemInsert, TOrderTable };
