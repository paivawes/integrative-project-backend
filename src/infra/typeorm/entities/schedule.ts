import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Room } from "./room";
import { ScheduleStatusEnum } from "../../../domain/enum/scheduleStatus";

@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn()
    id: string
    
    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "userId" })
    userId: string;
        
    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: "roomId" })
    roomId: string
    
    @Column()
    startToScheduling: Date
    
    @Column()
    endToScheduling: Date

    @Column()
    description: string

    @Column({
        type: 'enum',
        enum: ScheduleStatusEnum,
        default: ScheduleStatusEnum.PENDING
    })
    status: ScheduleStatusEnum

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ type: 'timestamptz', nullable: true })
    deletedAt: Date | null
}