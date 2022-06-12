import { Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { GetUser } from 'src/shared/presentation/helpers/decorators';
import { ExceptionResponseFilter } from 'src/shared/presentation/helpers/filter';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { UserAuthenticationDto } from '../dtos';
import { UserMapper } from '../mappers';

@Controller('auth')
export class ValidateUserController {
  @Post('self')
  @UseGuards(JwtAuthGuard)
  @UseFilters(ExceptionResponseFilter)
  async handle(@GetUser() user: UserEntity): Promise<UserAuthenticationDto> {
    return UserMapper.toDto(user);
  }
}
