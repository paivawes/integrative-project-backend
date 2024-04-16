import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @Column()
    capacity: number

    @Column()
    createdAt: Date
}