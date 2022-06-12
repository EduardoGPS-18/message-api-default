import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { UuidProtocol } from 'src/shared/domain/services/protocols';
import { MessageEntity } from '../../entities';
import { GroupRepository, MessageRepository } from '../repositories';

export type SendMessageParams = {
  groupId: string;
  message: string;
  senderId: string;
};

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly uuidProtocol: UuidProtocol,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(params: SendMessageParams) {
    const { groupId, message, senderId } = params;

    const group = await this.groupRepository.findById(groupId);
    const sender = await this.userRepository.findById(senderId);
    const sendedIn = new Date();
    const id = this.uuidProtocol.v4();

    const newMessage: MessageEntity = {
      id,
      sender,
      sendedIn,
      group,
      text: message,
    };
    await this.messageRepository.save(newMessage);
  }
}
