import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { AddUserOnGroupUseCase } from 'src/message/domain/services/usecases';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { AddUserOnGroupDto } from '../dtos';

@Controller('group')
export class AddUserOnGroupController {
  constructor(private readonly addUserOnGroupUseCase: AddUserOnGroupUseCase) {}

  @Post('add-user')
  @UseGuards(JwtAuthGuard)
  async handle(
    @GetUser() user: UserEntity,
    @Body() addUserOnGroupDto: AddUserOnGroupDto,
  ): Promise<any> {
    const { groupId, userId } = addUserOnGroupDto;
    const ownerId = user.id;
    return await this.addUserOnGroupUseCase.execute({
      groupId,
      userId,
      ownerId,
    });
  }
}
