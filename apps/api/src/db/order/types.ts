import { orderItemTable } from "../orderItem/schema";
import { orderTable } from "./schema";

type IOrder = typeof orderTable.$inferSelect;
type IOrderInsert = typeof orderTable.$inferInsert;

type IOrderItem = typeof orderItemTable.$inferSelect;
type IOrderItemInsert = typeof orderItemTable.$inferInsert;

interface INormalizedOrder extends Omit<IOrder, "totalPrice"> {
  totalPrice: number;
}

interface IOrderItemQuery {
  pizzaID: string;
  name: string;
  price: number;
}

interface IFullOrder extends INormalizedOrder {
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

export {
  INewOrder,
  IFullOrder,
  IOrder,
  INormalizedOrder,
  IOrderItem,
  IOrderItemQuery,
  IOrderInsert,
  IOrderItemInsert,
};
