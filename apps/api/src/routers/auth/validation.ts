import { zValidator } from "@hono/zod-validator";
import z from "zod/v4";

const signUpSchema = z
  .object({
    email: z.email(),
    "first-name": z.string().min(1).max(40),
    "last-name": z.string().min(1).max(80),
    password: z.string().min(8).max(16),
    "confirm-password": z.string(),
  })
  .refine((val) => val.password === val["confirm-password"])
  .strict();
const signUpValidator = zValidator("json", signUpSchema);

const loginSchema = z.object({ email: z.email(), password: z.string() });
const loginValidator = zValidator("json", loginSchema);

export { signUpValidator, loginValidator };
