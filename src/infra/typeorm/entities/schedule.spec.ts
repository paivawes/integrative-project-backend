import { Schedule } from './schedule';
import { User } from './user';
import { Room } from './room';
import { ScheduleStatusEnum } from '../../../domain/enum/scheduleStatus';

describe('Schedule Entity', () => {
  it('should create a Schedule entity with default values', () => {
    const user = new User();
    user.id = 'user-id';

    const room = new Room();
    room.id = 'room-id';

    const schedule = new Schedule();
    schedule.userId = user.id;
    schedule.roomId = room.id;
    schedule.startToScheduling = new Date('2024-10-30T10:00:00');
    schedule.endToScheduling = new Date('2024-10-30T12:00:00');
    schedule.description = 'Project Meeting';
    schedule.status = ScheduleStatusEnum.PENDING;
    schedule.createdAt = new Date();
    schedule.deletedAt = null;

    expect(schedule).toBeInstanceOf(Schedule);
    expect(schedule.userId).toBe(user.id);
    expect(schedule.roomId).toBe(room.id);
    expect(schedule.startToScheduling).toBeInstanceOf(Date);
    expect(schedule.endToScheduling).toBeInstanceOf(Date);
    expect(schedule.description).toBe('Project Meeting');
    expect(schedule.status).toBe(ScheduleStatusEnum.PENDING);
    expect(schedule.createdAt).toBeInstanceOf(Date);
    expect(schedule.deletedAt).toBeNull();
  });
});
