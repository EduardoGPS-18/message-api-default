import { JwtPayload, JwtProtocol } from 'src/shared/domain/services/protocols';
import { LoginUseCase } from '.';
import { UserEntity } from '../entities';
import { DomainErrors } from '../errors';
import { EncrypterProtocol } from '../services/protocols';
import { UserRepository } from '../services/repositories';

class EncrypterStub implements EncrypterProtocol {
  async compare(value: string, hash: string): Promise<boolean> {
    return true;
  }
  async encrypt(value: string): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  }
}

class JwtStub implements JwtProtocol {
  sign(payload: JwtPayload): string {
    return 'any_token';
  }
  verify(token: string): JwtPayload {
    return {
      email: 'any_mail',
      id: 'any_id',
    };
  }
}

const mockedUser = {
  id: 'any_id',
  email: 'any_email',
  password: 'any_pass',
  session: 'any_session',
  username: 'any_username',
};

class UserRepositoryStub implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity> {
    return mockedUser;
  }
  async findById(id: string): Promise<UserEntity> {
    return mockedUser;
  }
  async findWhereIds(ids: string[]): Promise<UserEntity[]> {
    return [];
  }
  async save(user: UserEntity): Promise<UserEntity> {
    return mockedUser;
  }
}

describe('LoginUseCase', () => {
  type SutTypes = {
    sut: LoginUseCase;
    encrypterStub: EncrypterStub;
    jwtStub: JwtStub;
    userRepositoryStub: UserRepositoryStub;
  };
  const makeSut = (): SutTypes => {
    let encrypterStub = new EncrypterStub();
    let jwtStub = new JwtStub();
    let userRepositoryStub = new UserRepositoryStub();
    let sut: LoginUseCase = new LoginUseCase(
      encrypterStub,
      jwtStub,
      userRepositoryStub,
    );
    return { sut, encrypterStub, jwtStub, userRepositoryStub };
  };

  it('Should call dependencies with correct values', async () => {
    const { sut, encrypterStub, jwtStub, userRepositoryStub } = makeSut();
    jest.spyOn(encrypterStub, 'compare');
    jest.spyOn(jwtStub, 'sign');
    jest
      .spyOn(userRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(mockedUser);
    jest.spyOn(userRepositoryStub, 'save').mockResolvedValue(mockedUser);

    await sut.execute({
      email: 'any_email',
      rawPassword: 'any_password',
    });

    expect(userRepositoryStub.findByEmail).toBeCalledWith('any_email');
    expect(encrypterStub.compare).toBeCalledWith('any_password', 'any_pass');
    expect(jwtStub.sign).toBeCalledWith({ id: 'any_id', email: 'any_email' });
    expect(userRepositoryStub.save).toBeCalledWith({
      id: mockedUser.id,
      email: mockedUser.email,
      password: mockedUser.password,
      session: 'any_token',
      username: mockedUser.username,
    });
  });

  it('Should throw DomainError.InvalidCredentials if email dont registered', async () => {
    const { sut, encrypterStub, jwtStub, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValue({
      id: '',
      email: '',
      password: '',
      session: '',
      username: '',
    });
    const promise = sut.execute({
      email: 'any_mail',
      rawPassword: 'any_password',
    });
    await expect(promise).rejects.toThrow(DomainErrors.InvalidCredentials);
  });
});
