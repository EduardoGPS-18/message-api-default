import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { ExceptionResponseFilter } from 'src/auth/presentation/helpers/filter/exception-response.filter';
import { UserEntity } from '../entities';
import { DomainErrors } from '../errors';
import { EncrypterProtocol, JwtProtocol } from '../services/protocols';
import { UserRepository } from '../services/repositories';

export type LoginParams = {
  email: string;
  rawPassword: string;
};

@Injectable()
@UseFilters(ExceptionResponseFilter)
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly encrypterProtocol: EncrypterProtocol,
    private readonly jwtProtocol: JwtProtocol,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(params: LoginParams): Promise<UserEntity> {
    const { email, rawPassword } = params;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.verbose(DomainErrors.InvalidCredentials.name);
      throw new DomainErrors.InvalidCredentials();
    }

    if (!(await this.encrypterProtocol.compare(rawPassword, user.password))) {
      this.logger.verbose(DomainErrors.InvalidCredentials.name);
      throw new DomainErrors.InvalidCredentials();
    }

    const session = this.jwtProtocol.sign({ id: user.id, email: user.email });
    user.session = session;
    try {
      await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      throw new DomainErrors.Unexpected();
    }
    return user;
  }
}
