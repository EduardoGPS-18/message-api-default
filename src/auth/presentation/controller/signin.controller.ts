import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { DomainErrors } from 'src/auth/domain/errors';
import { LoginUseCase } from 'src/auth/domain/usecases';
import { SigninDto, UserAuthenticationDto } from '../dtos/';
import { ExceptionResponseFilter } from '../helpers/filter';
import { UserMapper } from '../mappers';

@Controller('auth')
export class SigninController {
  constructor(private readonly loginUsecase: LoginUseCase) {}

  @Post('login')
  @UseFilters(ExceptionResponseFilter)
  async handle(@Body() params: SigninDto): Promise<UserAuthenticationDto> {
    try {
      const { email, password: rawPassword } = params;
      const user = await this.loginUsecase.execute({ email, rawPassword });

      return UserMapper.toDto(user);
    } catch (err) {
      if (err instanceof DomainErrors.InvalidCredentials) {
        const errorMsg = 'error.domain_error.invalid_credentials';
        throw new BadRequestException(errorMsg);
      } else {
        const errorMsg = 'error.domain_error.unexpected_error';
        throw new InternalServerErrorException(errorMsg);
      }
    }
  }
}
