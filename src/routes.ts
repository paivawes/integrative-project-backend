import { Router } from "express";
import { RoomController } from "./presentation/controller/roomController";
import { scheduleController } from "./presentation/controller/scheduleController";
import { UserController } from "./presentation/controller/userController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";


export const routes = Router();

routes.route('/login')
    .post(new UserController().login)
routes.use(AuthMiddleware)

routes.route('/user')
    .get(new UserController().findAll)
    .post(new UserController().create)

routes.route('/room')
    .get(new RoomController().findAll)
    .post(new RoomController().create)

routes.route('/room/id')
    .get(new RoomController().findById)

routes.route('/schedule')
    .get(new scheduleController().findAll)
    .post(new scheduleController().create)

routes.route('/schedule/id')
    .get(new scheduleController().findById)
    .delete(new scheduleController().deleteById)


