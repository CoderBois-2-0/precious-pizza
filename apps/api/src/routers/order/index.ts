import { OrderHandler } from "$db/order/handler";
import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";

interface IOrderVariables {
    orderHandler: OrderHandler;
}

const orderRouter = {
    path: "/order" as const,
    publicRouter,
    protectedRouter,
};

export { orderRouter, IOrderVariables };