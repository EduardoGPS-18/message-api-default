import { UserEntity } from 'src/auth/domain/entities';
import { GroupEntity } from '../../entities/group.entity';

export type UserInGroupParams = {
  groupId: string;
  userId: string;
};
export abstract class GroupRepository {
  abstract findById(id: string): Promise<GroupEntity>;
  abstract findGroupsByUserId(userId: string): Promise<GroupEntity[]>;
  abstract save(group: GroupEntity): Promise<GroupEntity>;
  abstract addUserInGroup(group: GroupEntity, user: UserEntity): Promise<void>;
  abstract userIsInGroup(params: UserInGroupParams): Promise<boolean>;
}
