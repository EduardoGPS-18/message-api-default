import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/domain/services/repositories';
import { DbUserRepository } from 'src/auth/infra/repositories';
import { JwtAdapter, UuidAdapter } from 'src/shared/infra/protocols';
import { JwtProtocol, UuidProtocol } from '../shared/domain/services/protocols';
import { GroupEntity, MessageEntity } from './domain/entities';
import {
  GroupRepository,
  MessageRepository,
} from './domain/services/repositories';
import {
  AddUserOnGroupUseCase,
  CreateGroupUseCase,
  GetUserGroupsUseCase,
} from './domain/services/usecases';
import { GetGroupMessagesUseCase } from './domain/services/usecases/get-group-messages.usecase';
import { SendMessageUseCase } from './domain/services/usecases/send-message.usecase';
import { DBGroupRepository } from './infra/repositories';
import { DbMessageRepository } from './infra/repositories/db-message.repository';
import {
  AddUserOnGroupController,
  CreateGroupController,
  GetGroupMessagesController,
  GetUserGroupsController,
  SendMessageController,
} from './presentation/controllers';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GroupEntity, MessageEntity])],
  providers: [
    { provide: UuidProtocol, useClass: UuidAdapter },
    { provide: GroupRepository, useClass: DBGroupRepository },
    { provide: UserRepository, useClass: DbUserRepository },
    { provide: MessageRepository, useClass: DbMessageRepository },
    { provide: JwtProtocol, useClass: JwtAdapter },

    CreateGroupUseCase,
    GetUserGroupsUseCase,
    AddUserOnGroupUseCase,
    SendMessageUseCase,
    GetGroupMessagesUseCase,
  ],
  controllers: [
    CreateGroupController,
    GetUserGroupsController,
    AddUserOnGroupController,
    SendMessageController,
    GetGroupMessagesController,
  ],
})
export class MessageModule {}
