import { WorkLogEntry, WorkLogEntryPrimitives } from '../../domain/workLog/WorkLogEntry';
import { WorkLogIngestRepository } from '../ports/WorkLogIngestRepository';

export type IngestWorkLogsInput = {
  entries: WorkLogEntryPrimitives[];
};

export type IngestWorkLogsOutput = {
  stored: number;
};

export class IngestWorkLogsUseCase {
  constructor(private readonly deps: { workLogIngestRepository: WorkLogIngestRepository }) {}

  async execute(input: IngestWorkLogsInput): Promise<IngestWorkLogsOutput> {
    const entries = input.entries.map((e) => WorkLogEntry.fromPrimitives(e));
    await this.deps.workLogIngestRepository.addMany(entries);
    return { stored: entries.length };
  }
}
