import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import type { ConsolePort } from './question-command-runner';
import type { FileSystemPort } from './question-store';

export class NodeFileSystem implements FileSystemPort {
  private readonly resolvedRoot: string;

  constructor(root: string) {
    this.resolvedRoot = resolve(root);
  }

  readText(path: string): string {
    return readFileSync(this.target(path), 'utf8');
  }

  writeText(path: string, text: string): void {
    writeFileSync(this.target(path), text, 'utf8');
  }

  writeBatch(files: ReadonlyMap<string, string>): void {
    const token = `${process.pid}-${Date.now()}`;
    const entries = [...files].map(([path, text], index) => ({
      target: this.target(path),
      temporary: `${this.target(path)}.codex-stage-${token}-${index}`,
      backup: `${this.target(path)}.codex-backup-${token}-${index}`,
      text,
      hadOriginal: false,
      installed: false
    }));
    try {
      entries.forEach((entry) => writeFileSync(entry.temporary, entry.text, 'utf8'));
      entries.forEach((entry) => install(entry));
    } catch (error) {
      rollback(entries);
      throw error;
    } finally {
      entries.forEach((entry) => removeIfPresent(entry.temporary));
    }
    entries.forEach((entry) => removeQuietly(entry.backup));
  }

  private target(path: string): string {
    const target = resolve(this.resolvedRoot, path);
    const relation = relative(this.resolvedRoot, target);
    if (!relation || relation === '..' || relation.startsWith(`..${sep}`) || isAbsolute(relation)) {
      throw new Error(`Path must stay inside the question-bank root: ${path}`);
    }
    return target;
  }
}

interface BatchEntry {
  readonly target: string;
  readonly temporary: string;
  readonly backup: string;
  readonly text: string;
  hadOriginal: boolean;
  installed: boolean;
}

function install(entry: BatchEntry): void {
  if (existsSync(entry.target)) {
    renameSync(entry.target, entry.backup);
    entry.hadOriginal = true;
  }
  renameSync(entry.temporary, entry.target);
  entry.installed = true;
}

function rollback(entries: readonly BatchEntry[]): void {
  [...entries].reverse().forEach((entry) => {
    if (entry.installed) removeIfPresent(entry.target);
    if (entry.hadOriginal && existsSync(entry.backup)) renameSync(entry.backup, entry.target);
    removeIfPresent(entry.temporary);
  });
}

function removeIfPresent(path: string): void {
  if (existsSync(path)) rmSync(path, { force: true });
}

function removeQuietly(path: string): void {
  try {
    removeIfPresent(path);
  } catch {
    // A stale backup is preferable to rolling back an already committed batch.
  }
}

export const nodeConsole: ConsolePort = {
  log: (message) => console.log(message),
  error: (message) => console.error(message)
};
