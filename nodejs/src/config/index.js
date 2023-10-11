import dotEnv from "dotenv";

dotEnv.config();

const { APP_NAME, APP_VERSION, NODE_ENV, NODE_PORT } = process.env;


export default {
  APP_NAME,
  APP_VERSION,
  NODE_ENV,
  NODE_PORT,
};
