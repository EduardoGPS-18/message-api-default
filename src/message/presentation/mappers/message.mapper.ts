import { UserMapper } from 'src/auth/presentation/mappers';
import { MessageEntity } from 'src/message/domain/entities';
import { MessageDto } from '../dtos';

export class MessageMapper {
  static toDto(message: MessageEntity): MessageDto {
    return {
      id: message.id,
      text: message.text,
      sendedIn: message.sendedIn,
      sender: UserMapper.toDto(message.sender),
    };
  }
}
