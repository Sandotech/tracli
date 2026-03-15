import { DomainError } from '../common/DomainError';

export class UserId {
  private constructor(public readonly value: string) {}

  static create(value: string): UserId {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError('User id cannot be empty.');
    }
    return new UserId(trimmed);
  }
}
