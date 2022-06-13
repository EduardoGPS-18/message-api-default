import { JwtPayload, JwtProtocol } from 'src/shared/domain/services/protocols';
import { ValidateUserUseCase } from '.';
import { UserEntity } from '../entities';
import { DomainError } from '../errors';
import { UserRepository } from '../services/repositories';

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

describe('ValidateUserUsecase', () => {
  type SutTypes = {
    sut: ValidateUserUseCase;
    jwtStub: JwtStub;
    userRepositoryStub: UserRepositoryStub;
  };
  const makeSut = (): SutTypes => {
    let jwtStub = new JwtStub();
    let userRepositoryStub = new UserRepositoryStub();
    let sut = new ValidateUserUseCase(userRepositoryStub, jwtStub);
    return { sut, jwtStub, userRepositoryStub };
  };

  it('Should call dependencies with correct values', async () => {
    const { sut, jwtStub, userRepositoryStub } = makeSut();
    const mockedJwt = mockedSavedUser.session;
    jest.spyOn(jwtStub, 'verify').mockReturnValueOnce({
      id: mockedSavedUser.id,
      email: mockedSavedUser.email,
    });
    jest
      .spyOn(userRepositoryStub, 'findById')
      .mockResolvedValueOnce(mockedSavedUser);

    await sut.execute({
      jwt: mockedJwt,
    });

    expect(jwtStub.verify).toBeCalledWith(mockedJwt);
    expect(userRepositoryStub.findById).toBeCalledWith(mockedSavedUser.id);
  });

  it('Should throw DomainError.InvalidUser if user dont exists', async () => {
    const { sut, jwtStub, userRepositoryStub } = makeSut();
    const mockedJwt = mockedSavedUser.session;
    jest.spyOn(jwtStub, 'verify').mockReturnValueOnce({
      id: mockedSavedUser.id,
      email: mockedSavedUser.email,
    });
    jest.spyOn(userRepositoryStub, 'findById').mockResolvedValueOnce({
      email: '',
      id: '',
      password: '',
      session: '',
      username: '',
    });

    const promise = sut.execute({
      jwt: mockedJwt,
    });

    expect(promise).rejects.toThrow(DomainError.InvalidUser);
  });

  it('Should throw DomainError.InvalidUser if session dont match with jwt', async () => {
    const { sut, jwtStub, userRepositoryStub } = makeSut();
    const mockedJwt = 'diferent_session';
    jest.spyOn(jwtStub, 'verify').mockReturnValueOnce({
      id: mockedSavedUser.id,
      email: mockedSavedUser.email,
    });
    jest
      .spyOn(userRepositoryStub, 'findById')
      .mockResolvedValueOnce(mockedSavedUser);

    const promise = sut.execute({
      jwt: mockedJwt,
    });

    expect(promise).rejects.toThrow(DomainError.InvalidUser);
  });

  it('Should returns user on operation succeed', async () => {
    const { sut, jwtStub, userRepositoryStub } = makeSut();
    const mockedJwt = 'diferent_session';
    jest.spyOn(jwtStub, 'verify').mockReturnValueOnce({
      id: mockedSavedUser.id,
      email: mockedSavedUser.email,
    });
    jest
      .spyOn(userRepositoryStub, 'findById')
      .mockResolvedValueOnce(mockedSavedUser);

    const promise = sut.execute({
      jwt: mockedJwt,
    });

    expect(promise).rejects.toThrow(DomainError.InvalidUser);
  });
});
