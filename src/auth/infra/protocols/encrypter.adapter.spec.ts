import * as bcrypt from 'bcrypt';
import { BcryptAdapter } from './encrypter.adapter';

jest.mock('bcrypt');

//TODO: Implement test on bcrypt fail
describe('Encrypter adapter', () => {
  const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter();
  };

  it('Should call encrypt with correct values', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce(() => 'any_salt');
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'any_hash');
    await sut.encrypt('any_value');
    expect(bcrypt.genSalt).toBeCalledWith(10);
    expect(bcrypt.hash).toBeCalledWith('any_value', 'any_salt');
  });

  it('Should call encrypt with correct values', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => 'any_hash');
    await sut.compare('any_value', 'any_hash');
    expect(bcrypt.compare).toBeCalledWith('any_value', 'any_hash');
  });

  it('Should return same of bcrypt on proccess succeed', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce(() => 'any_salt');
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'any_hash');
    const result = await sut.encrypt('any_value');
    expect(result).toBe('any_hash');
  });

  it('Should returns same of bcrypt on compare', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

    const hash = await sut.compare('any_value', 'any_hash');
    expect(hash).toBe(true);
  });
});

// ERROR REMINDER
// it('Should throw if bcrypt throw', async () => {
//   const sut = makeSut();
//   jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
//     throw new Error();
//   });
//   const promise = sut.encrypt('any_value');
//   expect(promise).toThrow(Error);
// });
