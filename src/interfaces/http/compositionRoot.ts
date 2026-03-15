import path from 'node:path';
import { IngestWorkLogsUseCase } from '../../application/usecases/IngestWorkLogsUseCase';
import { JsonFileWorkLogIngestRepository } from '../../infrastructure/persistence/json/JsonFileWorkLogIngestRepository';

export type HttpContainer = {
  ingestWorkLogs: IngestWorkLogsUseCase;
};

export function buildHttpContainer(): HttpContainer {
  const dataFile = process.env.TRACLI_CLOUD_DATA_FILE?.trim() || path.join(process.cwd(), 'data', 'cloud-logs.json');

  const workLogIngestRepository = new JsonFileWorkLogIngestRepository(dataFile);

  return {
    ingestWorkLogs: new IngestWorkLogsUseCase({ workLogIngestRepository }),
  };
}
