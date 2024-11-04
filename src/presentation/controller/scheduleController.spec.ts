import { Request, Response } from 'express';
import { scheduleController } from './scheduleController';
import { scheduleRepository } from '../../infra/typeorm/repositories/scheduleRepository';

jest.mock('../../infra/typeorm/repositories/scheduleRepository'); // Mock do repositório

describe('ScheduleController', () => {
    const controller = new scheduleController();

    const mockRequest = (params = {}, body = {}, query = {}) => ({
        params,
        body,
        query,
    } as Request);

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    it('should find all schedules', async () => {
        const req = mockRequest();
        const res = mockResponse();

        (scheduleRepository.find as jest.Mock).mockResolvedValue([{ id: 1, description: 'Meeting' }]);

        await controller.findAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, description: 'Meeting' }]);
    });

    it('should return a 404 error if schedule not found by ID', async () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();

        (scheduleRepository.findOne as jest.Mock).mockResolvedValue(null); // Simula que não encontrou

        await controller.findById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Agendamento não encontrado." });
    });

    it('should find a schedule by ID', async () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();

        (scheduleRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, description: 'Meeting' });

        await controller.findById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, description: 'Meeting' });
    });

    it('should create a new schedule', async () => {
        const req = mockRequest({}, {
            description: 'Meeting',
            userId: 1,
            roomId: 1,
            startToScheduling: new Date(),
            endToScheduling: new Date(new Date().getTime() + 60 * 60 * 1000),
            status: 'Scheduled',
        });
        const res = mockResponse();

        (scheduleRepository.create as jest.Mock).mockReturnValue(req.body);
        (scheduleRepository.save as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    it('should delete a schedule by ID', async () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();

        (scheduleRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, description: 'Meeting' });
        (scheduleRepository.remove as jest.Mock).mockResolvedValue(undefined); // Simula a remoção

        await controller.deleteById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Agendamento removido com sucesso." });
    });

    it('should return a 404 error when deleting a schedule that does not exist', async () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();

        (scheduleRepository.findOne as jest.Mock).mockResolvedValue(null); // Simula que não encontrou

        await controller.deleteById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Agendamento não encontrado." });
    });

    it('should handle errors when finding all schedules', async () => {
        const req = mockRequest();
        const res = mockResponse();

        (scheduleRepository.find as jest.Mock).mockRejectedValue(new Error('Database error'));

        await controller.findAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: 'Erro ao buscar agendamentos.' });
    });
});
