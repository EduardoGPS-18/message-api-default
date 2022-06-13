import {
  JwtPayload,
  JwtProtocol,
  UuidProtocol,
} from 'src/shared/domain/services/protocols';
import { SignupUseCase } from '.';
import { UserEntity } from '../entities';
import { DomainError, RepositoryError } from '../errors';
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
  findByEmail(email: string): Promise<UserEntity> {
    return Promise.resolve(mockedSavedUser);
  }
  findById(id: string): Promise<UserEntity> {
    return Promise.resolve(mockedSavedUser);
  }
  findWhereIds(ids: string[]): Promise<UserEntity[]> {
    return Promise.resolve([]);
  }
  save(user: UserEntity): Promise<UserEntity> {
    return Promise.resolve(mockedSavedUser);
  }
}

class UuidStub implements UuidProtocol {
  v4(): string {
    return 'any_uuid';
  }
}

describe('LoginUseCase', () => {
  type SutTypes = {
    sut: SignupUseCase;
    encrypterStub: EncrypterStub;
    jwtStub: JwtStub;
    userRepositoryStub: UserRepositoryStub;
    uuidStub: UuidStub;
  };
  const makeSut = (): SutTypes => {
    let encrypterStub = new EncrypterStub();
    let jwtStub = new JwtStub();
    let userRepositoryStub = new UserRepositoryStub();
    let uuidStub = new UuidStub();
    let sut: SignupUseCase = new SignupUseCase(
      encrypterStub,
      jwtStub,
      uuidStub,
      userRepositoryStub,
    );
    return { sut, encrypterStub, jwtStub, userRepositoryStub, uuidStub };
  };

  it('Should call dependencies with correct values', async () => {
    const { sut, encrypterStub, uuidStub, jwtStub, userRepositoryStub } =
      makeSut();
    const mockedJwt = 'any_jwt';
    const enteredEmail = 'any_email';
    const enteredPass = 'any_pass';
    const enteredUserName = 'any_username';
    const encryptedPass = 'any_encrypted';
    const mockedUuid = 'any_uuid';
    jest.spyOn(encrypterStub, 'compare');
    jest.spyOn(jwtStub, 'sign').mockReturnValueOnce(mockedJwt);
    jest
      .spyOn(userRepositoryStub, 'save')
      .mockResolvedValueOnce(mockedSavedUser);
    jest.spyOn(uuidStub, 'v4').mockReturnValueOnce(mockedUuid);
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(encryptedPass);

    await sut.execute({
      email: enteredEmail,
      rawPassword: enteredPass,
      username: enteredUserName,
    });
    expect(uuidStub.v4).toBeCalled();
    expect(encrypterStub.encrypt).toBeCalledWith(enteredPass);
    expect(jwtStub.sign).toBeCalledWith({
      id: mockedUuid,
      email: enteredEmail,
    });
    expect(userRepositoryStub.save).toBeCalledWith({
      username: enteredUserName,
      email: enteredEmail,
      password: encryptedPass,
      session: mockedJwt,
      id: mockedUuid,
    });
  });

  it('Should throw DomainError.Unexpected if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    const promise = sut.execute({
      email: 'any_email',
      rawPassword: 'any_pass',
      username: 'any_username',
    });
    await expect(promise).rejects.toThrow(DomainError.Unexpected);
  });

  it('Should throw DomainError.CredentialsAlreadyInUse if UserRepository throws RepositoryError.DuplicatedKey', async () => {
    const { sut, userRepositoryStub } = makeSut();
    jest
      .spyOn(userRepositoryStub, 'save')
      .mockRejectedValueOnce(new RepositoryError.DuplicatedKey());
    const promise = sut.execute({
      email: 'any_email',
      rawPassword: 'any_pass',
      username: 'any_username',
    });
    await expect(promise).rejects.toThrow(DomainError.CredentialsAlreadyInUse);
  });

  it('Should return user on operation succeed', async () => {
    const { sut, uuidStub, encrypterStub, jwtStub } = makeSut();
    const uuidMock = 'any_uuid';
    const encryptedPass = 'any_encrypted';
    const mockedJwt = 'any_jwt';
    jest.spyOn(uuidStub, 'v4').mockReturnValueOnce(uuidMock);
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(encryptedPass);
    jest.spyOn(jwtStub, 'sign').mockReturnValueOnce(mockedJwt);
    const user = await sut.execute({
      email: 'any_email',
      rawPassword: 'any_pass',
      username: 'any_username',
    });
    expect(user).toEqual({
      id: uuidMock,
      password: encryptedPass,
      session: mockedJwt,
      email: 'any_email',
      username: 'any_username',
    });
  });
});
