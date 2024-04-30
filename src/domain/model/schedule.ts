import { RoomModel } from "./room"
import { UserModel } from "./user"

export interface Schedule {
    id: string
    userId: UserModel
    roomId: RoomModel
    startToScheduling: Date
    endToScheduleing: Date
    description: string
    createdAt: Date
    deletedAt: Date
}