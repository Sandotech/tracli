import { DomainError } from '../common/DomainError';

export class TicketId {
  private constructor(public readonly value: string) {}

  static create(value: string): TicketId {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new DomainError('Ticket/PBI cannot be empty.');
    }
    return new TicketId(trimmed);
  }
}
