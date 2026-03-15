import { DomainError } from '../common/DomainError';
import { HoursWorked } from './HoursWorked';
import { TicketId } from './TicketId';
import { UserId } from './UserId';
import { WorkLogEntryId } from './WorkLogEntryId';

export type WorkLogEntryPrimitives = {
  id: string;
  userId: string;
  hoursWorked: number;
  ticketId?: string;
  description: string;
  createdAt: string;
  syncedAt?: string | null;
};

export class WorkLogEntry {
  private constructor(
    public readonly id: WorkLogEntryId,
    public readonly userId: UserId,
    public readonly hoursWorked: HoursWorked,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly ticketId?: TicketId,
    public readonly syncedAt?: Date | null,
  ) {}

  static create(params: {
    id: WorkLogEntryId;
    userId: UserId;
    hoursWorked: HoursWorked;
    description: string;
    createdAt: Date;
    ticketId?: TicketId;
    syncedAt?: Date | null;
  }): WorkLogEntry {
    const description = params.description.trim();
    if (description.length === 0) {
      throw new DomainError('Description is required.');
    }

    if (!(params.createdAt instanceof Date) || Number.isNaN(params.createdAt.getTime())) {
      throw new DomainError('createdAt must be a valid date.');
    }

    return new WorkLogEntry(
      params.id,
      params.userId,
      params.hoursWorked,
      description,
      params.createdAt,
      params.ticketId,
      params.syncedAt ?? null,
    );
  }

  static fromPrimitives(p: WorkLogEntryPrimitives): WorkLogEntry {
    const createdAt = new Date(p.createdAt);
    const syncedAt = p.syncedAt ? new Date(p.syncedAt) : null;

    return WorkLogEntry.create({
      id: WorkLogEntryId.create(p.id),
      userId: UserId.create(p.userId),
      hoursWorked: HoursWorked.create(p.hoursWorked),
      ticketId: p.ticketId ? TicketId.create(p.ticketId) : undefined,
      description: p.description,
      createdAt,
      syncedAt,
    });
  }

  toPrimitives(): WorkLogEntryPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      hoursWorked: this.hoursWorked.value,
      ticketId: this.ticketId?.value,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      syncedAt: this.syncedAt ? this.syncedAt.toISOString() : null,
    };
  }

  withSyncedAt(syncedAt: Date): WorkLogEntry {
    return WorkLogEntry.create({
      id: this.id,
      userId: this.userId,
      hoursWorked: this.hoursWorked,
      ticketId: this.ticketId,
      description: this.description,
      createdAt: this.createdAt,
      syncedAt,
    });
  }
}
