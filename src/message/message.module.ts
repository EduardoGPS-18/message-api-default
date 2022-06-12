import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { ValidateUserUseCase } from 'src/auth/domain/usecases/validate-user.usecase';
import { DbUserRepository } from 'src/auth/infra/repositories';
import {
  JwtProtocol,
  UuidProtocol,
} from 'src/shared/domain/services/protocols';
import { JwtAdapter, UuidAdapter } from 'src/shared/infra/protocols';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { GroupEntity, MessageEntity } from './domain/entities';
import { GroupRepository } from './domain/services/repositories';
import {
  AddUserOnGroupUseCase,
  CreateGroupUseCase,
  GetUserGroupsUseCase,
} from './domain/services/usecases';
import { DBGroupRepository } from './infra/repositories';
import {
  AddUserOnGroupController,
  CreateGroupController,
  GetUserGroupsController,
} from './presentation/controllers';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GroupEntity, MessageEntity])],
  providers: [
    JwtService,
    { provide: UuidProtocol, useClass: UuidAdapter },
    { provide: GroupRepository, useClass: DBGroupRepository },
    { provide: UserRepository, useClass: DbUserRepository },
    { provide: JwtProtocol, useClass: JwtAdapter },

    JwtAuthGuard,

    ValidateUserUseCase,
    CreateGroupUseCase,
    GetUserGroupsUseCase,
    AddUserOnGroupUseCase,
  ],
  controllers: [
    CreateGroupController,
    GetUserGroupsController,
    AddUserOnGroupController,
  ],
})
export class MessageModule {}
