import { UserController } from './userController';
import { Request, Response } from 'express';
import { userRepository } from '../../infra/typeorm/repositories/userRepository';
import jwt from 'jsonwebtoken';

jest.mock('../../infra/typeorm/repositories/userRepository');

const mockRequest = (body = {}, params = {}, query = {}): Partial<Request> => ({
    body,
    params,
    query,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
});

const mockResponse = (): Partial<Response> => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};

describe('UserController', () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController();        jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options) => {
            return 'mocked-token';
        });
    });

    it('should handle errors when finding all users', async () => {
        const req = mockRequest();
        const res = mockResponse();

        const error = new Error('Database error');
        (userRepository.find as jest.Mock).mockRejectedValue(error);

        await controller.findAll(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Erro ao buscar usuários.');
    });

    it('should login user and return a token', async () => {
        const req = mockRequest({ email: 'user@example.com', password: 'password' });
        const res = mockResponse();

        const user = { id: 1, email: 'user@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(user);

        await controller.login(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith({ user, token: 'mocked-token' });
    });

    it('should return 400 if login fails', async () => {
        const req = mockRequest({ email: 'user@example.com', password: 'wrongpassword' });
        const res = mockResponse();

        const user = { id: 1, email: 'user@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(user);

        await controller.login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "E-mail ou senha inválidos." });
    });

    it('should handle errors during user creation', async () => {
        const req = mockRequest({ email: 'user@example.com' });
        const res = mockResponse();

        const existingUser = { id: 1, email: 'user@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(existingUser);

        await controller.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "O email fornecido já está em uso." });
    });

    it('should create a new user', async () => {
        const req = mockRequest({ email: 'user@example.com', password: 'password' });
        const res = mockResponse();

        const newUser = { id: 1, email: 'user@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(null); 
        (userRepository.save as jest.Mock).mockResolvedValue(newUser);

        await controller.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newUser);
    });
});
