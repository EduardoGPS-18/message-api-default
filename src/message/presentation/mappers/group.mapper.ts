import { GroupEntity } from 'src/message/domain/entities';
import { GroupDto } from '../dtos';
import { UserMapper } from './user.mapper';

export class GroupMapper {
  static toDto(group: GroupEntity): GroupDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      owner: UserMapper.toDto(group.owner),
      users: group.users?.map((e) => UserMapper.toDto(e)),
    };
  }
}
