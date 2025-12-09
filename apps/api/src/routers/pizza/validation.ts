import z from "zod/v4";
import { createValidator } from "$routers/validation";

const pizzaQuery = z
  .object({
    categoryID: z.uuid().optional(),
    page: z.int().min(1).optional(),
    limit: z.int().min(1).max(100).default(20),
  })
  .strict();
const pizzaQueryValidator = createValidator("query", pizzaQuery);

const pizzaPostSchema = z
  .object({
    name: z.string().min(2).max(40),
    description: z.string().max(200),
    price: z.float32().min(0).transform((price) => price.toString()),
    isVisible: z.boolean(),
    categoryID: z.uuid(),
  })
  .strict();

const pizzaPostValidator = createValidator("json", pizzaPostSchema);

const pizzaPutSchema = pizzaPostSchema.partial();
const pizzaPutValidator = createValidator("json", pizzaPutSchema);

export { pizzaQueryValidator, pizzaPostValidator, pizzaPutValidator };
