import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { SendMessageUseCase } from 'src/message/domain/services/usecases/send-message.usecase';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { SendMessageDto } from '../dtos';

@Controller('message')
export class SendMessageController {
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @GetUser() user: UserEntity,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<any> {
    const { message, groupId } = sendMessageDto;
    const senderId = user.id;
    await this.sendMessageUseCase.execute({ groupId, message, senderId });
  }
}
