import z4, { z } from "zod/v4";
import { createValidator } from "$routers/validation";

const basketQuery = z
  .object({
    totalPrice: z
      .float32()
      .min(0)
      .transform((price) => price.toString()),
    createdAt: z.date(),
  })
  .strict();
const basketQueryValidator = createValidator("query", basketQuery);

export { basketQueryValidator };
