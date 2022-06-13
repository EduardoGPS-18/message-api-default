import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { JwtProtocol } from '../../../shared/domain/services/protocols';
import { ExceptionResponseFilter } from '../../../shared/presentation/helpers/filter';
import { UserEntity } from '../entities';
import { DomainError } from '../errors';
import { EncrypterProtocol } from '../services/protocols';
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
    try {
      const { email, rawPassword } = params;
      let user = await this.userRepository.findByEmail(email);

      if (!user.id) {
        this.logger.verbose(DomainError.InvalidCredentials.name);
        throw new DomainError.InvalidCredentials();
      }

      if (!(await this.encrypterProtocol.compare(rawPassword, user.password))) {
        this.logger.verbose(DomainError.InvalidCredentials.name);
        throw new DomainError.InvalidCredentials();
      }

      const session = this.jwtProtocol.sign({
        id: user.id,
        email: user.email,
      });
      user.session = session;
      try {
        await this.userRepository.save(user);
      } catch (err) {
        this.logger.error(err);
        throw new DomainError.Unexpected();
      }
      return user;
    } catch (err) {
      if (err instanceof DomainError.InvalidCredentials) {
        throw err;
      } else {
        throw new DomainError.Unexpected();
      }
    }
  }
}
