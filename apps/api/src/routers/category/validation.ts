import { createValidator } from "$routers/validation";
import z from "zod/v4";

const categoryPostSchema = z
  .object({
    name: z.string().min(2).max(40),
  })
  .strict();
const categoryPostValidator = createValidator("json", categoryPostSchema);

const categoryPutSchema = categoryPostSchema.partial();
const categoryPutValidator = createValidator("json", categoryPutSchema);

export { categoryPostValidator, categoryPutValidator };
