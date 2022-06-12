import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { GroupEntity } from 'src/message/domain/entities';
import {
  GroupRepository,
  UserInGroupParams,
} from 'src/message/domain/services/repositories';
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

  async findById(id: string): Promise<GroupEntity> {
    try {
      return await this.dataSource
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

  async userIsInGroup(params: UserInGroupParams): Promise<boolean> {
    try {
      const { groupId, userId } = params;
      const group = await this.dataSource
        .getRepository(GroupEntity)
        .createQueryBuilder('group')
        .leftJoin('users-group', 'g', 'group.id = g.groupId')
        .orWhere('group.ownerId = :userId AND group.id = :groupId', {
          userId,
          groupId,
        })
        .orWhere('g.userId = :userId AND group.id = :groupId', {
          userId,
          groupId,
        })
        .getOne();
      return !!group;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
