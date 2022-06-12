import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { GetUserGroupsUseCase } from 'src/message/domain/services/usecases';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { GroupMapper } from '../mappers';

@Controller('groups')
export class GetUserGroupsController {
  constructor(private readonly getUserGroupsUseCase: GetUserGroupsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@GetUser() user: UserEntity): Promise<any> {
    const groups = await this.getUserGroupsUseCase.execute(user.id);
    return groups.map((group) => GroupMapper.toDto(group));
  }
}
