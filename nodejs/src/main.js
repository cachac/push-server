import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes/index.js";
import config from "./config/index.js";
import { errorHandler } from "./middlewares/errorHandlers.js";

const app = express();

// middlewares
app.use(express.json({}));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(routes);
app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.error("AHHHHHHHHHHHHHHHHHHHHHHHHHH! :", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("ERRRRRRRRRRRRRRRRRRRRRRRRRR! :", err);
  process.exit(1);
});

app.listen(3001, () => {
  console.log(`Listening to port ${config.NODE_PORT} - Express JS | REST API`);
});
