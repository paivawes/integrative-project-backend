import { Request, Response } from 'express';
import { RoomController } from './roomController';
import { roomRepository } from '../../infra/typeorm/repositories/roomRepository';
import { Room } from '../../infra/typeorm/entities/room';

jest.mock('../../infra/typeorm/repositories/roomRepository');

describe('RoomController', () => {
    let roomController: RoomController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        roomController = new RoomController();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    describe('findAll', () => {
        it('should return all rooms', async () => {
            const rooms: Room[] = [{ id: '1', name: 'Conference Room', capacity: 20, createdAt: new Date() }];
            (roomRepository.find as jest.Mock).mockResolvedValue(rooms);

            await roomController.findAll(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(rooms);
        });

        it('should handle errors', async () => {
            (roomRepository.find as jest.Mock).mockRejectedValue(new Error('Database error'));

            await roomController.findAll(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao buscar salas.' });
        });
    });

    describe('findById', () => {
        it('should return a room by ID', async () => {
            const room: Room = { id: '1', name: 'Conference Room', capacity: 20, createdAt: new Date() };
            req.params = { id: '1' };
            (roomRepository.findOne as jest.Mock).mockResolvedValue(room);

            await roomController.findById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(room);
        });

        it('should return 404 if room not found', async () => {
            req.params = { id: '2' };
            (roomRepository.findOne as jest.Mock).mockResolvedValue(null);

            await roomController.findById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Sala não encontrada." });
        });

        it('should handle errors', async () => {
            req.params = { id: '1' };
            (roomRepository.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await roomController.findById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao buscar sala.' });
        });
    });

});
