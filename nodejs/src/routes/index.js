import express from "express";
// import { sticky } from "../util/sticky.js";
import * as subs from "../controllers/subscription.js";

const router = express.Router();

// health checks
const APP_NAME = "nodejs app";
const APP_VERSION = "1.0.0";
router.get("/healthcheck", (_, res) => {
  res.send({ app: APP_NAME, version: APP_VERSION, sticky });
});

// POST CRUD
router.get("/key", subs.GET_KEY);
router.post("/subscribe", subs.SUBSCRIBE);
router.post("/unsubscribe", subs.UNSUBSCRIBE);
router.post("/push", subs.PUSH);

export default router;
