import { Injectable, Logger } from '@nestjs/common';
import { GroupEntity, MessageEntity } from 'src/message/domain/entities';
import { MessageRepository } from 'src/message/domain/services/repositories';
import { DataSource } from 'typeorm';

@Injectable()
export class DbMessageRepository implements MessageRepository {
  private readonly logger = new Logger(DbMessageRepository.name);

  constructor(private readonly dataSource: DataSource) {}

  async findByGroup(group: GroupEntity): Promise<MessageEntity[]> {
    return await this.dataSource.getRepository(MessageEntity).find({
      where: { group },
    });
  }

  async save(message: MessageEntity): Promise<void> {
    try {
      await this.dataSource.getRepository(MessageEntity).save(message);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
