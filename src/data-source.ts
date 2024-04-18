import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./infra/typeorm/entities/user";

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [`${__dirname}/**/entities/*.{ts,js}`],
    synchronize: true
  }); 