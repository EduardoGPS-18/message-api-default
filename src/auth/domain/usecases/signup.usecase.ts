import { Injectable, Logger } from '@nestjs/common';
import {
  JwtProtocol,
  UuidProtocol,
} from '../../../shared/domain/services/protocols';
import { UserEntity } from '../entities';
import { DomainError, RepositoryError } from '../errors';
import { EncrypterProtocol } from '../services/protocols';
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
    try {
      const { username, email, rawPassword } = params;

      const id = this.uuidProtocol.v4();
      const password = await this.encrypterProtocol.encrypt(rawPassword);
      const session = this.jwtProtocol.sign({ id, email });

      const user: UserEntity = { id, email, password, session, username };

      await this.userRepository.save(user);

      return user;
    } catch (err) {
      if (err instanceof RepositoryError.DuplicatedKey) {
        throw new DomainError.CredentialsAlreadyInUse();
      }
      throw new DomainError.Unexpected();
    }
  }
}
