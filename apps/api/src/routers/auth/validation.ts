import { createValidator } from "$routers/validation";
import z from "zod/v4";

const signUpSchema = z
  .object({
    email: z.email(),
    "first-name": z.string().min(1).max(40),
    "last-name": z.string().min(1).max(80),
    password: z.string().min(8).max(16),
    "confirm-password": z.string(),
  })
  .refine((val) => val.password === val["confirm-password"], {
    message: "The passwords must match",
    path: ["confirm-password"],
  })
  .strict();
const signUpValidator = createValidator("json", signUpSchema);

const loginSchema = z.object({ email: z.email(), password: z.string() });
const loginValidator = createValidator("json", loginSchema);

export { signUpValidator, loginValidator };
