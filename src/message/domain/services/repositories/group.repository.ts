import { UserEntity } from 'src/auth/domain/entities';
import { MessageEntity } from '../../entities';
import { GroupEntity } from '../../entities/group.entity';

export abstract class GroupRepository {
  abstract findById(id: string): Promise<GroupEntity>;
  abstract findGroupsByUserId(userId: string): Promise<GroupEntity[]>;
  abstract save(group: GroupEntity): Promise<GroupEntity>;
  abstract addUserInGroup(group: GroupEntity, user: UserEntity): Promise<void>;
  abstract addMessageInGroup(
    group: GroupEntity,
    message: MessageEntity,
  ): Promise<void>;
}
