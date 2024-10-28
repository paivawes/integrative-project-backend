import { UserController } from './userController'; // Ajuste o caminho se necessário
import { Request, Response } from 'express';
import { userRepository } from '../../infra/typeorm/repositories/userRepository';
import jwt from 'jsonwebtoken';

// Mock do repositório de usuários
jest.mock('../../infra/typeorm/repositories/userRepository');

// Defina a chave secreta diretamente ou use uma variável de ambiente
const mockSecretKey = 'mocked-secret-key';

const mockRequest = (body = {}, params = {}, query = {}): Partial<Request> => ({
    body,
    params,
    query,
    // Adicione métodos do Request conforme necessário
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
        controller = new UserController();
        // Mock do método jwt.sign para usar a chave secreta
        jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options) => {
            return 'mocked-token'; // Retorne um token mockado
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
        const req = mockRequest({ email: 'john@example.com', password: 'password' });
        const res = mockResponse();

        const user = { id: 1, email: 'john@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(user);

        await controller.login(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith({ user, token: 'mocked-token' }); // Verifique o token mockado
    });

    it('should return 400 if login fails', async () => {
        const req = mockRequest({ email: 'john@example.com', password: 'wrongpassword' });
        const res = mockResponse();

        const user = { id: 1, email: 'john@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(user);

        await controller.login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "E-mail ou senha inválidos." });
    });

    it('should handle errors during user creation', async () => {
        const req = mockRequest({ email: 'john@example.com' });
        const res = mockResponse();

        const existingUser = { id: 1, email: 'john@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(existingUser); // Simula que o usuário já existe

        await controller.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "O email fornecido já está em uso." });
    });

    it('should create a new user', async () => {
        const req = mockRequest({ email: 'john@example.com', password: 'password' });
        const res = mockResponse();

        const newUser = { id: 1, email: 'john@example.com', password: 'password' };
        (userRepository.findOne as jest.Mock).mockResolvedValue(null); // Simula que o usuário não existe
        (userRepository.save as jest.Mock).mockResolvedValue(newUser);

        await controller.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newUser);
    });
});
