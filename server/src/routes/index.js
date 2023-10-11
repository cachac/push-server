import { Hono } from "hono";
import { jwt } from "hono/jwt";
import config from "../config/index.js";
import {
  GET_KEY,
  SUBSCRIBE,
  UNSUBSCRIBE,
  PUSH,
} from "../controllers/subscription.js";
// import {} from "../controllers/subscription"

export const router = new Hono();

const secret = config.TOKEN_SECRET;

// router.use("*", jwt({ secret }));

router.get("/healthcheck", (c) =>
  c.json({ app: config.APP_NAME, version: config.APP_VERSION })
);
router.get("/key", (c, next) => GET_KEY(c, next));
// router.get("/*", (c) => {
//   c.status(404);
//   return c.text("Not Found");
// });
router.post("/subscribe", (c, next) => SUBSCRIBE(c, next));
router.post("/unsubscribe", (c, next) => UNSUBSCRIBE(c, next));
router.post("/push", (c, next) => PUSH(c, next));
// router.post("/*", (c) => {
//   c.status(404);
//   return c.text("Not Found");
// });
