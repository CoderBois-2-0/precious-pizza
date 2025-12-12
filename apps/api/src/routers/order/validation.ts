import { z } from "zod/v4";
import { createValidator } from "$routers/validation";

const orderParamSchema = z.object({ id: z.string().uuid() });
const orderParamValidator = createValidator("param", orderParamSchema);

const orderBasketParamSchema = z.object({ basketID: z.string().uuid() });
const orderBasketParamValidator = createValidator(
  "param",
  orderBasketParamSchema,
);

const deliveryAddressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  postalCode: z.string().min(1),
  town: z.string().min(1),
  doorFloor: z.string().min(1).optional(),
});

const orderPostSchema = z
  .object({
    basketID: z.string().uuid(),
    delivery: z.enum(["Pickup", "Delivery"]),
    deliveryFee: z.coerce.number().min(0).optional(),
    deliveryAddress: deliveryAddressSchema.optional(),
    customerNote: z
      .string()
      .trim()
      .max(500)
      .refine((val) => !/[<>]/.test(val), "Note cannot contain < or >")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.delivery === "Delivery") {
        return !!data.deliveryAddress;
      }
      return true;
    },
    {
      message: "Delivery address is required when delivery option is Delivery",
    },
  );
const orderPostValidator = createValidator("json", orderPostSchema);

export { orderParamValidator, orderBasketParamValidator, orderPostValidator };
