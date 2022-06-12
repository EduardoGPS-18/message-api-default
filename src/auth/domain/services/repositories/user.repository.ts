import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities';

@Injectable()
export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity>;
  abstract findWhereIds(ids: string[]): Promise<UserEntity[]>;
  abstract save(user: UserEntity): Promise<UserEntity>;
}
