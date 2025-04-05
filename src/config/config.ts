import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  env: string;
  connectionUrl: string;
}

const config: Config = {
  port: Number(process.env.SERVER_PORT) || 3000,
  env: process.env.NODE_ENV || "development",
  connectionUrl:
    process.env.POSTGRES_URL ||
    "postgresql://postgres:password@localhost:5432/postgres",
};

export default config;
