import z from "zod/v4";
import { createValidator } from "$routers/validation";

const pizzaPostSchema = z
  .object({
    name: z.string().min(2).max(40),
    description: z.string().max(200),
    price: z.float32().min(0),
    categoryID: z.uuid(),
  })
  .strict();

const pizzaPostValidator = createValidator("json", pizzaPostSchema);

const pizzaPutSchema = pizzaPostSchema.partial();
const pizzaPutValidator = createValidator("json", pizzaPutSchema);

export { pizzaPostValidator, pizzaPutValidator };
