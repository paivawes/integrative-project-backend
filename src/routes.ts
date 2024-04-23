import { Router } from "express";
import { RoomController } from "./presentation/controller/roomController";
import { scheduleController } from "./presentation/controller/scheduleController";
import { UserController } from "./presentation/controller/userController";


export const routes = Router();

routes.route('/user')
    .get(new UserController().findAll)
    .post(new UserController().create)

routes.route('/user/id')
    .get(new UserController().findById)

routes.route('/room')
    .get(new RoomController().create)
    .post(new RoomController().findAll)

routes.route('/room/id')
    .get(new RoomController().findById)

    routes.route('/schedule')
    .get(new scheduleController().create)
    .post(new scheduleController().findAll)

routes.route('/schedule/id')
    .get(new scheduleController().findById)


