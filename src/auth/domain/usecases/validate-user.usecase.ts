import { Injectable, Logger } from '@nestjs/common';
import { JwtProtocol } from '../../../shared/domain/services/protocols';
import { UserEntity } from '../entities';
import { DomainError } from '../errors';
import { UserRepository } from '../services/repositories';

export type ValidateUserParams = {
  jwt: string;
};

@Injectable()
export class ValidateUserUseCase {
  private readonly logger = new Logger(ValidateUserUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProtocol: JwtProtocol,
  ) {}

  async execute(params: ValidateUserParams): Promise<UserEntity> {
    const { jwt } = params;
    const { id } = this.jwtProtocol.verify(jwt);
    const user = await this.userRepository.findById(id);

    if (!user || user.session !== jwt) {
      this.logger.verbose(DomainError.InvalidUser.name);
      throw new DomainError.InvalidUser();
    }

    return user;
  }
}
