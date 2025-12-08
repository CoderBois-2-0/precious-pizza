import publicRouter from "./publicRouter";
import protectedRouter from "./protectedRouter";
import PizzaHandler from "$db/pizza/handler";

interface IPizzaVariables {
  pizzaHandler: PizzaHandler;
}

const pizzaRouter = {
  path: "/pizza" as const,
  publicRouter,
  protectedRouter,
};

export { pizzaRouter, IPizzaVariables };
