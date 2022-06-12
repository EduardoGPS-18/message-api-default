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
    JwtService,
    { provide: UuidProtocol, useClass: UuidAdapter },
    { provide: GroupRepository, useClass: DBGroupRepository },
    { provide: UserRepository, useClass: DbUserRepository },
    { provide: MessageRepository, useClass: DbMessageRepository },
    { provide: JwtProtocol, useClass: JwtAdapter },

    JwtAuthGuard,
    ValidateUserUseCase,

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
