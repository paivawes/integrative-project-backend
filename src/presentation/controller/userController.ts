import { Request, Response } from 'express';
import { userRepository } from '../../infra/typeorm/repositories/userRepository';
import jwt from "jsonwebtoken";

export class UserController {

    async findAll(req: Request, res: Response) {
        try {
            const users = await userRepository.find();

            return res.status(200).json(users)
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await userRepository.findOne({ where: { email: email, password: password } })

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "E-mail ou senha inválidos." });
            }

            const token = jwt.sign({ id: `${user?.id}` }, process.env.JWT_PASS ?? "", { expiresIn: "12h" });

            return res.json({ user, token });
        } catch (error: any) {
            const status = error.status || 500;
            return res.status(status).send(error.message || "Erro interno do servidor.");
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, email, password, type } = req.body;

            const existingUser = await userRepository.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ error: "O email fornecido já está em uso." });
            }

            const user = userRepository.create({
                name,
                email,
                password,
                type
            })

            const userCreate = await userRepository.save(user)

            return res.status(201).json(userCreate);
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

}