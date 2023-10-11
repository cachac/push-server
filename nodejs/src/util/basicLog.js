import winston from "winston";
import { sticky } from "../util/sticky.js";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: { app: "nodejs-app", sticky },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});
