import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Room } from "./room";

@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "userId" })
    userId: string;


    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: "roomId" })
    roomId: string

    @Column()
    startToScheduling: Date

    @Column()
    endToScheduleing: Date

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column()
    deletedAt: Date
}