import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { DomainErrors, RepositoryError } from '../errors';
import {
  EncrypterProtocol,
  JwtProtocol,
  UuidProtocol,
} from '../services/protocols';
import { UserRepository } from '../services/repositories';

export type SignUpParams = {
  username: string;
  email: string;
  rawPassword: string;
};

@Injectable()
export class SignupUseCase {
  private readonly logger = new Logger(SignupUseCase.name);

  constructor(
    private readonly encrypterProtocol: EncrypterProtocol,
    private readonly jwtProtocol: JwtProtocol,
    private readonly uuidProtocol: UuidProtocol,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(params: SignUpParams): Promise<UserEntity> {
    const { username, email, rawPassword } = params;

    const id = this.uuidProtocol.v4();
    const password = await this.encrypterProtocol.encrypt(rawPassword);
    const session = this.jwtProtocol.sign({ id, email });

    const user: UserEntity = { id, email, password, session, username };
    try {
      await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof RepositoryError.DuplicatedKey) {
        throw new DomainErrors.CredentialsAlreadyInUse();
      }
    }
    return user;
  }
}
