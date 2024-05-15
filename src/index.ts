import express from "express";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";
import cors from "cors"; 

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  app.use(cors());
  app.use(routes);

  return app.listen(process.env.PORT);
});