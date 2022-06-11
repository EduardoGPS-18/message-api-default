export class RepositoryError {
  static DuplicatedKey = class DuplicatedKey extends Error {};
  static NotFound = class NotFound extends Error {};
}
