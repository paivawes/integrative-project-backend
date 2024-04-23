import { scheduleRepository } from "../../infra/typeorm/repositories/scheduleRepository";
import { Request, Response } from 'express';

export class scheduleController {
    async findAll(req: Request, res: Response) {
        try {
            const schedules = await scheduleRepository.find({ relations: ["userId", "roomId"] });

            return res.status(200).json(schedules)
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const schedule = await scheduleRepository.findOne({ where: { id: id } })
            return res.status(200).json(schedule)
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, userId, roomId, startToScheduling, endToScheduling } = req.body;
            const schedule = scheduleRepository.create({
                name,
                userId,
                roomId,
                startToScheduling,
                endToScheduling
            })
            console.log(schedule)
            const userCreate = scheduleRepository.save(schedule)
            return res.status(201).json(userCreate);
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }
}