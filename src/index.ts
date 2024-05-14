import express from "express";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";


var cors = require('cors')
AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());
  
  app.use(cors({
    origin: 'http://localhost:5173/'
  }));
  app.use(routes);

  return app.listen(process.env.PORT);
});