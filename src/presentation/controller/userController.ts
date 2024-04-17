import { Request, Response } from 'express';
import { userRepository } from '../../infra/typeorm/repositories/userRepository';

export class UserController {

    async findAll(req: Request, res: Response) {
        try {

            const users = await userRepository.find();
            return res.status(200).json(users)
            
        } catch {
            console.log('errorooooo')
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const user = userRepository.create({
                name,
                email,
                password,
            })

            console.log(user, 'u')

            const userCreate = userRepository.save(user)

            console.log(userCreate, 'uc')

            return res.status(201).json(userCreate);
        } catch (error: any) {
            return res.status(error.status).send(error);
        }
    }

}