import { d as createSsrRpc } from "./router-BF6gDh8M.mjs";
import { a as createServerFn } from "./server-DzLy7LQ_.mjs";
import "../_libs/react.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const registerUser = createServerFn({
  method: "POST"
}).validator((data) => data).handler(createSsrRpc("48770f03c0a9130022649905a60f8f048d18396918fb019e795e65dd4c610592"));
const loginUser = createServerFn({
  method: "POST"
}).validator((data) => data).handler(createSsrRpc("b24e0e40c43ef78291413c28052ef2169c860cf431c05794573b93afe14fbb17"));
const verifyEmail = createServerFn({
  method: "GET"
}).validator((token) => token).handler(createSsrRpc("d9ac571df00b8be22a113fa87708d9c383547e2fba8031d5c92fde8a1aead668"));
const logoutUser = createServerFn({
  method: "POST"
}).handler(createSsrRpc("289dd21824763016b70c280b308d60d5fc8d58e300d6c7d7abbe54af56a996dc"));
const getSessionUser = createServerFn({
  method: "GET"
}).handler(createSsrRpc("26e8c253bbf3abd7b2964a8d1457a6529b805f8e031b811fc6b64c4fceb703a7"));
export {
  getSessionUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail
};
