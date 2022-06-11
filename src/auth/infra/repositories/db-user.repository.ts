import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { RepositoryError } from 'src/auth/domain/errors';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { DataSource } from 'typeorm';

@Injectable()
export class DbUserRepository implements UserRepository {
  private readonly logger = new Logger(DbUserRepository.name);

  constructor(private readonly dataSource: DataSource) {}

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
