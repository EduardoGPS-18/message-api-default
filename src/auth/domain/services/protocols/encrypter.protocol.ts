export abstract class EncrypterProtocol {
  abstract encrypt(value: string): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}
