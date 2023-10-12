import { Hono } from "hono";
import { cors } from "hono/cors";
import { router } from "./routes/index.js";
import { errorHandlers } from "./middlewares/errorHandlers.js";
import config from "./config/index.js";

const app = new Hono();
app.use("*", cors());
app.route("/", router);
app.use("*", (c, next) => errorHandlers(c, next));
app.onError((err, c) => {
  console.error("Global Application Error :>> ", err);
  return c.text("App Error Message", 500);
});

console.log(
  `App: ${config.APP_NAME} v${config.APP_VERSION} listening to port ${config.NODE_PORT} - BUN JS | REST 🚀`
);

export default {
  fetch: app.fetch,
  port: config.NODE_PORT || 3001,
};
