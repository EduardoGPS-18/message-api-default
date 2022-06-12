import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../../entities';
import { GroupRepository, MessageRepository } from '../repositories';

export type GetGroupMessagesParams = {
  groupId: string;
  userId: string;
};

@Injectable()
export class GetGroupMessagesUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute({
    groupId,
    userId,
  }: GetGroupMessagesParams): Promise<MessageEntity[]> {
    const group = await this.groupRepository.findById(groupId);
    const messages = await this.messageRepository.findByGroup(group);

    const isOnGroup = await this.groupRepository.userIsInGroup({
      groupId: groupId,
      userId: userId,
    });

    if (isOnGroup) {
      throw Error();
    }

    return messages;
  }
}
