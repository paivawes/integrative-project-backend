import { AppDataSource } from "../../../data-source";
import { Schedule } from "../entities/schedule";

export const scheduleRepository = AppDataSource.getRepository(Schedule)