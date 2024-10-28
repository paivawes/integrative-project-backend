import { User } from './user';
import { UserTypeEnum } from '../../../domain/enum/userType';

describe('User Entity', () => {
  it('should create a User entity with default values', () => {
    const user = new User();
    user.name = 'User';
    user.email = 'user@example.com';
    user.password = 'senha123';
    user.createdAt = new Date();
    user.type = UserTypeEnum.NORMAL;

    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('User');
    expect(user.email).toBe('user@example.com');
    expect(user.password).toBe('senha123');
    expect(user.type).toBe(UserTypeEnum.NORMAL);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should allow setting the user type to ADMIN', () => {
    const user = new User();
    user.type = UserTypeEnum.ADMIN;

    expect(user.type).toBe(UserTypeEnum.ADMIN);
  });
});
