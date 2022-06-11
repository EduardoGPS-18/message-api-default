import { Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities';
import { UserAuthenticationDto } from '../dtos';
import { GetUser } from '../helpers/decorators';
import { ExceptionResponseFilter } from '../helpers/filter';
import { JwtAuthGuard } from '../helpers/guards';
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
