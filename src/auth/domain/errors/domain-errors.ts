export class DomainErrors {
  static CredentialsAlreadyInUse = class CredentialsAlreadyInUse extends Error {};
  static InvalidCredentials = class InvalidCredentials extends Error {};
  static Unexpected = class Unexpected extends Error {};
  static InvalidUser = class InvalidUser extends Error {};
}
