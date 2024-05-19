import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserTypeEnum } from "../../../domain/enum/userType";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: UserTypeEnum,
        default: UserTypeEnum.NORMAL
    })
    type: UserTypeEnum

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}