# tracli-restapi (TraCli Sync API)

Express + TypeScript REST API that receives work logs pushed by the TraCli CLI (`tracli sync`).

The CLI lives in a separate repository (**`tracli-cli`**) so it can be installed and released independently.

## Status

MVP / ingest-only:

- Accepts batches of work log entries via `POST /api/v1/logs`
- Persists entries to a JSON file (configurable)
- No authentication yet (treat as a dev/local service)

## Requirements

- Node.js **18+**

## Quickstart

```bash
npm install
npm run dev
```

Health check:

```bash
curl -sS http://localhost:3000/health
```

Send logs:

```bash
curl -sS -X POST http://localhost:3000/api/v1/logs \
  -H 'content-type: application/json' \
  -d '{"entries":[{"id":"11111111-1111-1111-1111-111111111111","userId":"local-test","hoursWorked":2,"ticketId":"DEV-402","description":"Implemented auth middleware","createdAt":"2026-03-08T12:00:00.000Z","syncedAt":null}]}'
```

## Scripts

- `npm run dev` — run the API in development (tsx)
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server
- `npm run typecheck` — strict typecheck
- `npm run clean` — remove `dist/`

## API

### `GET /health`

Response:

```json
{ "status": "ok" }
```

### `POST /api/v1/logs`

Ingest a batch of work log entries.

Request body:

```json
{
  "entries": [
    {
      "id": "uuid",
      "userId": "uuid",
      "hoursWorked": 2,
      "ticketId": "DEV-402",
      "description": "Implemented auth middleware",
      "createdAt": "2026-03-08T12:00:00.000Z",
      "syncedAt": null
    }
  ]
}
```

Response:

```json
{ "stored": 1 }
```

Validation rules (domain):

- `hoursWorked` must be between **0.5** and **12**
- `description` is required
- `createdAt` must be a valid ISO datetime

Error responses:

- `400 { "error": "..." }` for invalid payloads
- `500 { "error": "..." }` for unexpected server errors

## Configuration

Environment variables:

- `PORT` — server port (default: `3000`)
- `TRACLI_CLOUD_DATA_FILE` — where ingested logs are stored (default: `./data/cloud-logs.json`)

Notes:

- The server creates the parent directory for `TRACLI_CLOUD_DATA_FILE` automatically.
- The default `./data/` directory is intended to be local-only (it should be ignored by git).

## Architecture (DDD / Clean)

- `src/domain` — entities + value objects + domain validation (framework-free)
- `src/application` — use cases + ports (interfaces)
- `src/infrastructure` — persistence adapters (current: JSON file)
- `src/interfaces/http` — Express HTTP adapter

## Integration with the CLI

Configure the CLI to point to this server:

```bash
export TRACLI_API_BASE_URL=http://localhost:3000
```

Then run:

```bash
tracli sync
```

## Roadmap

- Authentication/authorization for multi-user usage
- Replace JSON file storage with a real database (PostgreSQL/SQL Server)
- Query endpoints (e.g., weekly summaries server-side)
