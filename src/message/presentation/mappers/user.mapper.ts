import { UserEntity } from 'src/auth/domain/entities';
import { UserDto } from '../dtos';

export class UserMapper {
  static toDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
