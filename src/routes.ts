import { Router } from "express";
import { RoomController } from "./presentation/controller/roomController";
import { scheduleController } from "./presentation/controller/scheduleController";
import { UserController } from "./presentation/controller/userController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";


export const routes = Router();

routes.route('/login')
    .post(new UserController().login)

routes.route('/user')
    .post(new UserController().create)

routes.use(AuthMiddleware)

routes.route('/user')
    .get(new UserController().findAll)

routes.route('/room')
    .get(new RoomController().findAll)
    .post(new RoomController().deleteById)

routes.route('/room/id')
    .get(new RoomController().findById)
    .delete(new RoomController().findById)

routes.route('/schedule')
    .get(new scheduleController().findAll)
    .post(new scheduleController().create)

routes.route('/schedule/id')
    .get(new scheduleController().findById)
    .delete(new scheduleController().deleteById)
    .put(new scheduleController().update)


