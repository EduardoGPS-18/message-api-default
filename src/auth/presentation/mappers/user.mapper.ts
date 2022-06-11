import { UserEntity } from 'src/auth/domain/entities';
import { UserAuthenticationDto } from '../dtos';

export class UserMapper {
  static toDto(user: UserEntity): UserAuthenticationDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      accessToken: user.session,
    };
  }
}
