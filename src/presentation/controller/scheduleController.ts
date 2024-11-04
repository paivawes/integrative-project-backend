import { scheduleRepository } from "../../infra/typeorm/repositories/scheduleRepository";
import { Request, Response } from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export class scheduleController {
    async findAll(req: Request, res: Response) {
        try {
            const { status, user, startPeriod, endPeriod } = req.query

            let query: any = { relations: ["userId", "roomId"] }

            if (status) {
                query.where = { status }
            }

            if (user) {
                query.where = { ...query.where, userId: { id: user } }
            }

            if (startPeriod && endPeriod) {
                query.where = {
                    ...query.where,
                    startToScheduling: MoreThanOrEqual(startPeriod),
                    endToScheduling: LessThanOrEqual(endPeriod)
                }
            }

            const schedules = await scheduleRepository.find(query)

            return res.status(200).json(schedules)
        } catch (error: any) {
            return res.status(500).send({ error: 'Erro ao buscar agendamentos.' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const schedule = await scheduleRepository.findOne({ where: { id } });
    
            if (!schedule) {
                return res.status(404).json({ error: "Agendamento não encontrado." });
            }
    
            return res.status(200).json(schedule);
        } catch (error: any) {
            return res.status(500).send({ error: 'Erro ao buscar agendamento.' });
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
            const { id } = req.params;
            const schedule = await scheduleRepository.findOne({ where: { id } });
    
            if (!schedule) {
                return res.status(404).json({ error: "Agendamento não encontrado." });
            }
    
            await scheduleRepository.remove(schedule);
            return res.status(200).json({ message: "Agendamento removido com sucesso." });
        } catch (error: any) {
            return res.status(500).send({ error: "Erro ao processar a solicitação." });
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