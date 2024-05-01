import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  ssl: { rejectUnauthorized: false },
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  name: process.env.DB_SCHEMA,
  schema: process.env.DB_SCHEMA,
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  synchronize: true
}); 