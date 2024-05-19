import { scheduleRepository } from "../../infra/typeorm/repositories/scheduleRepository";
import { Request, Response } from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export class scheduleController {
    async findAll(req: Request, res: Response) {
        try {
            const { status, user, startPeriod, endPeriod } = req.query;
    
            let query: any = { relations: ["userId", "roomId"] };
    
            // Adicionar filtro de status, se presente
            if (status) {
                query.where = { status };
            }
    
            // Adicionar filtro de userId, se presente
            if (user) {
                query.where = { ...query.where, userId: { id: user } };
            }
    
            // Adicionar filtro por período, se ambos startPeriod e endPeriod estiverem presentes
            if (startPeriod && endPeriod) {
                query.where = {
                    ...query.where,
                    startToScheduling: MoreThanOrEqual(startPeriod),
                    endToScheduling: LessThanOrEqual(endPeriod)
                };
            }
    
            const schedules = await scheduleRepository.find(query);
    
            return res.status(200).json(schedules);
        } catch (error: any) {
            return res.status(error.status || 500).send(error.message);
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
            const { description, userId, roomId, startToScheduling, endToScheduling, status } = req.body

            const schedule = scheduleRepository.create({
                userId,
                roomId,
                description,
                startToScheduling,
                endToScheduling,
                status
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

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { description, userId, roomId, startToScheduling, endToScheduling, status } = req.body

            const scheduleUpdate = await scheduleRepository.update(id, {
                userId,
                roomId,
                description,
                startToScheduling,
                endToScheduling,
                status
            })

            if (!scheduleUpdate) {
                return res.status(404).json({ error: "Agendamento não encontrado" })
            }

            return res.status(200).json(scheduleUpdate)
        } catch (error: any) {
            return res.status(error.status).send(error)
        }
    }
}