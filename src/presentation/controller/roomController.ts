import { Request, Response } from 'express';
import { roomRepository } from '../../infra/typeorm/repositories/roomRepository';

export class RoomController {
    async findAll(req: Request, res: Response) {
        try {
            const rooms = await roomRepository.find();
            return res.status(200).json(rooms);
        } catch (error: any) {
            return res.status(500).send({ error: 'Erro ao buscar salas.' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const room = await roomRepository.findOne({ where: { id } });
            
            if (!room) {
                return res.status(404).json({ error: "Sala não encontrada." });
            }

            return res.status(200).json(room);
        } catch (error: any) {
            return res.status(500).send({ error: 'Erro ao buscar sala.' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, capacity } = req.body;
            const existingRoom = await roomRepository.findOne({ where: { name } });

            if (existingRoom) {
                return res.status(400).json({ error: "O nome da sala fornecido já está em uso." });
            }

            const user = roomRepository.create({ name, capacity });
            const roomCreate = await roomRepository.save(user);

            return res.status(201).json(roomCreate);
        } catch (error: any) {
            return res.status(500).send({ error: 'Erro ao criar sala.' });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const room = await roomRepository.findOne({ where: { id } });

            if (!room) {
                return res.status(404).json({ error: "Sala não encontrada." });
            }

            await roomRepository.remove(room);
            return res.status(200).json({ message: "Sala removida com sucesso." });
        } catch (error: any) {
            return res.status(500).send({ error: "Erro ao processar a solicitação." });
        }
    }
}
