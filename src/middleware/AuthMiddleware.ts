import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../infra/typeorm/repositories/userRepository";
import { UnauthorizedError } from "../helper/request-errors";

type JwtPayload = {
  id: string
};

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const token = authorization.split(" ")[1];

      const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload

      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      const { password: _, ...loggedUser } = user;

      req.user = loggedUser;
    } else {
      throw new UnauthorizedError("Token not provided");
    }

    next();
  } catch (error: any) {

    if (error.statusCode === 401) {
      res.status(401).end()
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}
