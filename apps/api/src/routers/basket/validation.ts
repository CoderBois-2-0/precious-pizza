import { z } from "zod/v4";
import { createValidator } from "$routers/validation";

// Path params validator for routes using :id (basketID)
const basketParamSchema = z.object({
  id: z.string().uuid(),
});
const basketParamValidator = createValidator("param", basketParamSchema);

// Path params validator for delete item route
const basketItemParamSchema = z.object({
  id: z.string().uuid(), // basketID
  itemID: z.coerce.number().int().positive(), // basketItem ID
});
const basketItemParamValidator = createValidator("param", basketItemParamSchema);

// Body validator for creating a basket (empty body accepted)
const basketPostSchema = z.object({}).strict();
const basketPostValidator = createValidator("json", basketPostSchema);

// Body validator for adding an item to a basket
const basketAddItemSchema = z
  .object({
    pizzaID: z.string().uuid(),
    quantity: z.coerce.number().int().min(1),
    price: z.coerce.number().min(0),
  })
  .strict();
const basketAddItemValidator = createValidator("json", basketAddItemSchema);

export {
  basketParamValidator,
  basketItemParamValidator,
  basketPostValidator,
  basketAddItemValidator,
};


