import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { UuidProtocol } from 'src/shared/domain/services/protocols';
import { GroupEntity } from '../../entities';
import { GroupRepository } from '../repositories/group.repository';

export type CreateGroupParams = {
  ownerId: string;
  name: string;
  description: string;
  userIDList: string[];
};

@Injectable()
export class CreateGroupUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly uuidProtocol: UuidProtocol,
  ) {}

  async execute(params: CreateGroupParams): Promise<GroupEntity> {
    const id = this.uuidProtocol.v4();
    const { ownerId, name, description, userIDList } = params;
    const messages = [];

    const users = await this.userRepository.findWhereIds(userIDList);
    const owner = await this.userRepository.findById(ownerId);
    const group: GroupEntity = {
      id,
      owner,
      name,
      description,
      users,
      messages,
    };

    await this.groupRepository.save(group);

    return group;
  }
}
