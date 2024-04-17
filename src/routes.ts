import { Router } from "express";
import { UserController } from "./presentation/controller/userController";


export const routes = Router();

routes.route('/user')
    .get(new UserController().findAll)
    .post(new UserController().create)