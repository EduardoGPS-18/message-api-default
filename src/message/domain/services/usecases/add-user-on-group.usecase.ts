import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { GroupRepository } from '../repositories';

export type AddUserOnGroupParams = {
  ownerId: string;
  groupId: string;
  userId: string;
};

@Injectable()
export class AddUserOnGroupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(params: AddUserOnGroupParams): Promise<void> {
    const { groupId, userId, ownerId } = params;

    const user = await this.userRepository.findById(userId);
    const group = await this.groupRepository.findById(groupId);

    if (group.owner.id != ownerId) {
      throw Error();
    }

    group.users.push(user);
    await this.groupRepository.save(group);
  }
}
