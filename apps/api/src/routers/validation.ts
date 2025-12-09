import { ValidationTargets } from "hono";
import { validator } from "hono/validator";
import * as z from "zod/v4/core";

/**
 * @description
 * createValidator will create a validator based on a zod schema,
 * if it fails the error returned is a prettier version than the default zod error returned by zvalidator
 * @param validationTarget - The target to validate, e.g. 'json', 'form', 'query' etc.
 * @param schema - The zod schema used to validate the validationTarget
 * @returns A hono validator that uses zod
 */
function createValidator<TSchema extends z.$ZodType>(
  validationTarget: keyof ValidationTargets,
  schema: TSchema,
) {
  return validator(validationTarget, (val, c) => {
    const schemaResult = z.safeParse(schema, val);
    if (!schemaResult.success) {
      const prettyError = z.prettifyError(schemaResult.error);

      return c.json({ message: prettyError }, 400);
    }

    return schemaResult.data;
  });
}

export { createValidator };
