import { WorkLogEntry } from '../../domain/workLog/WorkLogEntry';

export interface WorkLogIngestRepository {
  addMany(entries: WorkLogEntry[]): Promise<void>;
}
