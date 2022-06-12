import { Injectable } from '@nestjs/common';
import { GroupEntity } from '../../entities';
import { GroupRepository } from '../repositories';

@Injectable()
export class GetUserGroupsUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async execute(userID: string): Promise<GroupEntity[]> {
    return await this.groupRepository.findGroupsByUserId(userID);
  }
}
