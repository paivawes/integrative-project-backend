import { Express } from 'express';
import cors from 'cors';

export function setupMiddlewares(app: Express): void {
    app.use(cors());
}