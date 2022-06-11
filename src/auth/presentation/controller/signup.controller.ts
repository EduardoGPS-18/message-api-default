import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DomainErrors } from 'src/auth/domain/errors';
import { SignupUseCase } from 'src/auth/domain/usecases/';
import { SignUpDto, UserAuthenticationDto } from '../dtos';
import { ExceptionResponseFilter } from '../helpers/filter';
import { UserMapper } from '../mappers';

@Controller('auth')
export class SignupController {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  @Post('signup')
  @UseFilters(ExceptionResponseFilter)
  async handle(
    @Body() dto: SignUpDto,
    @I18n() i18n: I18nContext,
  ): Promise<UserAuthenticationDto> {
    const { email, password: rawPassword, username } = dto;
    try {
      const signupParams = { username, email, rawPassword };
      const user = await this.signupUseCase.execute(signupParams);

      return UserMapper.toDto(user);
    } catch (err) {
      if (err instanceof DomainErrors.CredentialsAlreadyInUse) {
        const errorMsg = 'error.domain_error.credentials_in_use';
        throw new BadRequestException(errorMsg);
      } else {
        const errorMsg = 'error.domain_error.unexpected_error';
        throw new InternalServerErrorException(errorMsg);
      }
    }
  }
}
