import { Hono } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";

import { TSafeUser } from "$db/user/types";
import { IEnv, TContext, IProtectedEnv } from "./types";

function createRouter<TEnv extends IEnv = IEnv>() {
  return new Hono<TEnv>();
}

const authTokenName = "auth-token";

/**
 * @description
 * setAuthCookie will set the jwt cookie
 */
async function setAuthCookie<TEnv extends IEnv = IEnv>(
  c: TContext<TEnv>,
  payload: TSafeUser,
) {
  const jwtValue = await sign(payload, c.env.JWT_SECRET);

  setCookie(c, authTokenName, jwtValue, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 3,
    secure: c.env.PROD === "true",
  });
}

function removeAuthCookie<TEnv extends IProtectedEnv = IProtectedEnv>(
  c: TContext<TEnv>,
) {
  deleteCookie(c, authTokenName);
}

export { createRouter, setAuthCookie, removeAuthCookie, authTokenName };
