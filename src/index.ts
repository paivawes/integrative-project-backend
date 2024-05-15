import express from "express";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";
import cors from "cors"; 
import { createProxyMiddleware } from "http-proxy-middleware";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use('/api', createProxyMiddleware({ target: 'https://integrative-project-backend.vercel.app', changeOrigin: true }));
  app.use(express.static('public'));
  app.use(express.json());
  app.use(cors());
  app.use(routes);

  return app.listen(process.env.PORT);
});