import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { DomainErrors } from '../errors';
import { JwtProtocol } from '../services/protocols';
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
      this.logger.verbose(DomainErrors.InvalidUser.name);
      throw new DomainErrors.InvalidUser();
    }

    return user;
  }
}
