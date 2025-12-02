import { createRouter } from "$routers/index";

const router = createRouter().get("sign-out", (c) => {
  return c.json({}, 500);
});

export default router;
