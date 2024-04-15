import { RoomModel } from "./room"
import { UserModel } from "./user"

export interface Schedule {
    id: string
    name: string
    userId: UserModel
    roomId: RoomModel
    startToScheduling: Date
    endToScheduleing: Date
    createdAt: Date
    deletedAt: Date
}