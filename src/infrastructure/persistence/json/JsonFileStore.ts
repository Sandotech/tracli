import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class JsonFileStore {
  constructor(private readonly filePath: string) {}

  async readJson<T>(defaultValue: T): Promise<T> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return JSON.parse(raw) as T;
    } catch (err: any) {
      if (err?.code === 'ENOENT') {
        return defaultValue;
      }
      throw err;
    }
  }

  async writeJson<T>(value: T): Promise<void> {
    const dir = path.dirname(this.filePath);
    await mkdir(dir, { recursive: true });

    const tmpPath = `${this.filePath}.tmp-${process.pid}-${Date.now()}`;
    const raw = `${JSON.stringify(value, null, 2)}\n`;

    await writeFile(tmpPath, raw, 'utf8');
    await rename(tmpPath, this.filePath);
  }
}
