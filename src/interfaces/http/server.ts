import express from 'express';
import { DomainError } from '../../domain/common/DomainError';
import { WorkLogEntryPrimitives } from '../../domain/workLog/WorkLogEntry';
import { buildHttpContainer } from './compositionRoot';

const container = buildHttpContainer();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/v1/logs', async (req, res) => {
  try {
    const body = req.body as { entries?: WorkLogEntryPrimitives[] };

    if (!body || !Array.isArray(body.entries)) {
      res.status(400).json({ error: 'Body must be { entries: WorkLogEntryPrimitives[] }' });
      return;
    }

    const result = await container.ingestWorkLogs.execute({ entries: body.entries });
    res.status(200).json({ stored: result.stored });
  } catch (err: any) {
    if (err instanceof DomainError) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

const port = Number.parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => {
  console.log(`TraCli API listening on http://localhost:${port}`);
});
