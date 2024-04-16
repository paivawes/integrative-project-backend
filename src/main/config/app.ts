import express from 'express';
import { setupMiddlewares, setupRoutes } from './';
import { config } from 'dotenv';
config();

const app = express();

setupMiddlewares(app);
setupRoutes(app);

export { app };
