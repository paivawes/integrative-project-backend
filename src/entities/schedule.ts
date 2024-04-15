import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "../domain/model/user";
import { RoomModel } from "../domain/model/room";
import { User } from "./user";
import { Room } from "./room";

@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @ManyToOne(() => User)
    @Column()
    userId: UserModel

    @ManyToOne(() => Room)
    @Column()
    roomId: RoomModel

    @Column()
    startToScheduling: Date

    @Column()
    endToScheduleing: Date

    @Column()
    createdAt: Date

    @Column()
    deletedAt: Date
}