import { DomainError } from '../common/DomainError';

export class WorkLogEntryId {
  private constructor(public readonly value: string) {}

  static create(value: string): WorkLogEntryId {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError('Entry id cannot be empty.');
    }
    return new WorkLogEntryId(trimmed);
  }
}
