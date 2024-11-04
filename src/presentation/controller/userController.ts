import { Request, Response } from 'express';
import { userRepository } from '../../infra/typeorm/repositories/userRepository';
import jwt from 'jsonwebtoken';

export class UserController {
    async findAll(req: Request, res: Response): Promise<any> {
        try {
            const users = await userRepository.find();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).send('Erro ao buscar usuários.');
        }
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: "E-mail ou senha inválidos." });
            }

            if (user.password !== password) {
                return res.status(400).json({ message: "E-mail ou senha inválidos." });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_PASS as string, { expiresIn: "12h" });

            return res.status(200).json({ user, token });
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            return res.status(500).send('Erro ao realizar login.');
        }
    }

    async create(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;
            const existingUser = await userRepository.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ error: "O email fornecido já está em uso." });
            }

            const newUser = userRepository.create(req.body);
            const savedUser = await userRepository.save(newUser);
            return res.status(201).json(savedUser);
        } catch (error) {
            return res.status(500).send('Erro ao criar usuário.');
        }
    }
}