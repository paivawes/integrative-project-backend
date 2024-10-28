import { Room } from './room';

describe('Room Entity', () => {
  it('should create a Room entity with default values', () => {
    const room = new Room();
    room.name = 'Conference Room';
    room.capacity = 20;
    room.createdAt = new Date();

    expect(room).toBeInstanceOf(Room);
    expect(room.name).toBe('Conference Room');
    expect(room.capacity).toBe(20);
    expect(room.createdAt).toBeInstanceOf(Date);
  });

  it('should have a default createdAt value', () => {
    const room = new Room();
    room.createdAt = new Date();

    expect(room.createdAt).toBeInstanceOf(Date);
  });
});