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

const mockedSavedUser = {
  id: 'any_id',
  email: 'any_email',
  password: 'any_pass',
  session: 'any_session',
  username: 'any_username',
};

class UserRepositoryStub implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity> {
    return mockedSavedUser;
  }
  async findById(id: string): Promise<UserEntity> {
    return mockedSavedUser;
  }
  async findWhereIds(ids: string[]): Promise<UserEntity[]> {
    return [];
  }
  async save(user: UserEntity): Promise<UserEntity> {
    return mockedSavedUser;
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
    const enteredEmail = 'any_email';
    const enteredPass = 'any_password';
    const mockedJwt = 'signed_jwt';
    jest.spyOn(encrypterStub, 'compare');
    jest.spyOn(jwtStub, 'sign').mockReturnValueOnce(mockedJwt);
    jest
      .spyOn(userRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(mockedSavedUser);
    jest.spyOn(userRepositoryStub, 'save').mockResolvedValue(mockedSavedUser);

    await sut.execute({ email: enteredEmail, rawPassword: enteredPass });

    expect(userRepositoryStub.findByEmail).toBeCalledWith(enteredEmail);
    expect(encrypterStub.compare).toBeCalledWith(
      enteredPass,
      mockedSavedUser.password,
    );
    expect(jwtStub.sign).toBeCalledWith({ id: 'any_id', email: enteredEmail });
    expect(userRepositoryStub.save).toBeCalledWith({
      id: mockedSavedUser.id,
      email: mockedSavedUser.email,
      password: mockedSavedUser.password,
      session: mockedJwt,
      username: mockedSavedUser.username,
    });
  });

  it('Should throw DomainError.InvalidCredentials if email dont registered', async () => {
    const { sut, userRepositoryStub } = makeSut();
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

  it('Should throw DomainError.InvalidCredentials if password doesnt match', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'compare').mockResolvedValue(false);
    const promise = sut.execute({
      email: 'any_mail',
      rawPassword: 'any_password',
    });
    await expect(promise).rejects.toThrow(DomainErrors.InvalidCredentials);
  });

  it('Should throw DomainError.Unexpected if UserRepository.save throws', async () => {
    const { sut, userRepositoryStub } = makeSut();
    jest.spyOn(userRepositoryStub, 'save').mockRejectedValueOnce(new Error());
    const promise = sut.execute({
      email: 'any_mail',
      rawPassword: 'any_password',
    });
    await expect(promise).rejects.toThrow(DomainErrors.Unexpected);
  });

  it('Should return user on success', async () => {
    const { sut } = makeSut();
    const user = await sut.execute({
      email: 'any_mail',
      rawPassword: 'any_password',
    });
    expect(user).toEqual(mockedSavedUser);
  });
});
