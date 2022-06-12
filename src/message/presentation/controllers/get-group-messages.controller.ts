import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { GetGroupMessagesUseCase } from 'src/message/domain/services/usecases/get-group-messages.usecase';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';

@Controller('group')
export class GetGroupMessagesController {
  constructor(private readonly getGroupMessages: GetGroupMessagesUseCase) {}

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async handle(@GetUser() user: UserEntity, @Query() groupId: string) {
    const userId = user.id;
    const messages = await this.getGroupMessages.execute({ groupId, userId });

    return messages;
  }
}
