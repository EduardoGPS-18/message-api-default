import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { CreateGroupUseCase } from 'src/message/domain/services/usecases';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { CreateGroupDto } from '../dtos';
import { GroupMapper } from '../mappers';

@Controller('group')
export class CreateGroupController {
  constructor(private readonly createGroupUseCase: CreateGroupUseCase) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async handle(
    @GetUser() user: UserEntity,
    @Body() params: CreateGroupDto,
  ): Promise<any> {
    const { description, name, userIDList } = params;
    const ownerId = user.id;
    const group = await this.createGroupUseCase.execute({
      description,
      name,
      ownerId,
      userIDList,
    });

    return GroupMapper.toDto(group);
  }
}
