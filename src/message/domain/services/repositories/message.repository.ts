import { GroupEntity, MessageEntity } from '../../entities';

export abstract class MessageRepository {
  abstract save(message: MessageEntity): Promise<void>;
  abstract findByGroup(group: GroupEntity): Promise<MessageEntity[]>;
}
