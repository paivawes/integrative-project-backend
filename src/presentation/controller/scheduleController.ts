import { scheduleRepository } from "../../infra/typeorm/repositories/scheduleRepository";
import { Request, Response } from 'express';

export class scheduleController {
    async findAll(req: Request, res: Response) {
        try {
            const schedules = await scheduleRepository.find({ relations: ["userId", "roomId"] })

            return res.status(200).json(schedules)
        } catch (error: any) {
            return res.status(error.status).send(error)
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const schedule = await scheduleRepository.findOne({ where: { id: id } })
            return res.status(200).json(schedule)
        } catch (error: any) {
            return res.status(error.status).send(error)
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { description, userId, roomId, startToScheduling, endToScheduling } = req.body

            const schedule = scheduleRepository.create({
                userId,
                roomId,
                description,
                startToScheduling,
                endToScheduling
            })

            const userSchedule = await scheduleRepository.save(schedule)
            return res.status(201).json(userSchedule)
        } catch (error: any) {
            return res.status(error.status).send(error)
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const schedule = await scheduleRepository.findOne({ where: { id } })
    
            if (!schedule) {
                return res.status(404).json({ error: "Agendamento não encontrado." })
            }

            const scheduleDelete = await scheduleRepository.remove(schedule)
    
            return res.status(200).json(scheduleDelete)
        } catch (error: any) {
            return res.status(500).send({ error: "Erro ao processar a solicitação." })
        }
    }
}