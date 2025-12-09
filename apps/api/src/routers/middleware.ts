import { createMiddleware } from "hono/factory";
import { TProtectedVariables } from "./types";

const requireAdmin = createMiddleware<{ Variables: TProtectedVariables }>(
  async (c, next) => {
    const user = c.get("jwtPayload");
    if (user.role !== "admin") {
      return c.json({ message: "Lacking priveleges" }, 403);
    }

    return next();
  },
);

export { requireAdmin };
