import { Hono } from "hono";
import { jwt } from "hono/jwt";
import config from "../config";
import { GET_KEY } from "../controllers/push"
// import {} from "../controllers/subscription"

export const router = new Hono();

const secret = config.TOKEN_SECRET;

// router.use("*", jwt({ secret }));

router.get("/healthcheck", (c) => c.json({ app: config.APP_NAME, version: config.APP_VERSION }))
router.get("/key", (c) => GET_KEY(c, next))




