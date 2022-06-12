import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { GroupEntity, MessageEntity } from 'src/message/domain/entities';
import { GroupRepository } from 'src/message/domain/services/repositories';
import { DataSource } from 'typeorm';

@Injectable()
export class DBGroupRepository implements GroupRepository {
  private readonly logger = new Logger(DBGroupRepository.name);
  constructor(private readonly dataSource: DataSource) {}

  async addUserInGroup(group: GroupEntity, user: UserEntity): Promise<void> {
    try {
      await this.dataSource
        .getRepository(GroupEntity)
        .save({ ...group, users: [...group.users, user] });
      this.logger.verbose(`User added in a group ${group.id}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async addMessageInGroup(
    group: GroupEntity,
    message: MessageEntity,
  ): Promise<void> {
    try {
      await this.dataSource
        .getRepository(GroupEntity)
        .save({ ...group, messages: [...group.messages, message] });
      this.logger.verbose(`Message sended to to a group ${group.id}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  findById(id: string): Promise<GroupEntity> {
    try {
      return this.dataSource
        .getRepository(GroupEntity)
        .findOne({ where: { id } });
    } catch (err) {
      this.logger.error(err);
    }
  }
  async findGroupsByUserId(userId: string): Promise<GroupEntity[]> {
    try {
      const x = await this.dataSource
        .getRepository(GroupEntity)
        .createQueryBuilder('group')
        .leftJoin('users-group', 'g', 'group.id = g.groupId')
        .where('group.ownerId = :userId OR g.userId = :userId', { userId })
        .getMany();
      return x;
    } catch (err) {
      this.logger.error(err);
    }
  }
  async save(group: GroupEntity): Promise<GroupEntity> {
    try {
      await this.dataSource.getRepository(GroupEntity).save(group);
      return group;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
