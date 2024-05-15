import express from "express";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";
import cors from "cors"; 

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());
  
  app.use(cors());
  app.options('*');
  app.use(routes);

  return app.listen(process.env.PORT);
});