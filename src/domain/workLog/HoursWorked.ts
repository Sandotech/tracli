import { DomainError } from '../common/DomainError';

export class HoursWorked {
  private constructor(public readonly value: number) {}

  static create(value: number): HoursWorked {
    if (!Number.isFinite(value)) {
      throw new DomainError('Hours worked must be a valid number.');
    }

    if (value < 0.5 || value > 12) {
      throw new DomainError('Hours worked must be between 0.5 and 12.');
    }

    return new HoursWorked(value);
  }
}
