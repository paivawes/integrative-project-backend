import { Request, Response } from 'express';
import { roomRepository } from '../../infra/typeorm/repositories/roomRepository';

export class RoomController {
    async findAll(req: Request, res: Response) {
        try {
            const rooms = await roomRepository.find();

            return res.status(200).json(rooms)
        } catch (error: any) {
            return res.status(error.status).send(error)
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const room = await roomRepository.findOne({ where: { id: id } })
            return res.status(200).json(room)
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, capacity } = req.body;
            const user = roomRepository.create({name, capacity})
            const roomCreate = roomRepository.save(user)
            return res.status(201).json(roomCreate);
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

}