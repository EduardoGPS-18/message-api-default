import { Injectable, Logger } from '@nestjs/common';
import { RepositoryError } from 'src/auth/domain/errors';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../domain/entities';
import { UserRepository } from '../../domain/services/repositories';

@Injectable()
export class DbUserRepository implements UserRepository {
  private readonly logger = new Logger(DbUserRepository.name);

  constructor(private readonly dataSource: DataSource) {}

  async findWhereIds(ids: string[]): Promise<UserEntity[]> {
    try {
      if (ids.length == 0) {
        return [];
      }
      return this.dataSource
        .getRepository(UserEntity)
        .createQueryBuilder()
        .where('id IN (:...ids)', { ids })
        .getMany();
    } catch (err) {
      this.logger.error(err);
    }
  }

  findByEmail(email: string): Promise<UserEntity> {
    try {
      return this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { email } });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findById(id: string): Promise<UserEntity> {
    try {
      return await this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { id } });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.dataSource.getRepository(UserEntity).save(user);
    } catch (err) {
      if (err.code === '23505') {
        this.logger.error(RepositoryError.DuplicatedKey.name);
        throw new RepositoryError.DuplicatedKey();
      }
    }
  }
}
