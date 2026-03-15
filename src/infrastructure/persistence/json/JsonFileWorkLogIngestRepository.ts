import { WorkLogIngestRepository } from '../../../application/ports/WorkLogIngestRepository';
import { WorkLogEntry } from '../../../domain/workLog/WorkLogEntry';
import { JsonFileStore } from './JsonFileStore';

type CloudStateV1 = {
  version: 1;
  entries: ReturnType<WorkLogEntry['toPrimitives']>[];
};

function defaultCloudState(): CloudStateV1 {
  return { version: 1, entries: [] };
}

export class JsonFileWorkLogIngestRepository implements WorkLogIngestRepository {
  private readonly store: JsonFileStore;

  constructor(filePath: string) {
    this.store = new JsonFileStore(filePath);
  }

  async addMany(entries: WorkLogEntry[]): Promise<void> {
    const current = await this.store.readJson<CloudStateV1>(defaultCloudState());
    const next: CloudStateV1 = {
      version: 1,
      entries: [...current.entries, ...entries.map((e) => e.toPrimitives())],
    };
    await this.store.writeJson(next);
  }
}
