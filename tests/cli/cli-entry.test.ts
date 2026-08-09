import { describe, expect, it } from 'vitest';
import { runCli } from '../../tools/questions/cli-entry';

class MemoryFileSystem {
  readonly files = new Map<string, string>([
    ['data/questions/cpp.json', '[]'],
    ['data/questions/gof.json', '[]'],
    ['data/questions/ue5.json', '[]'],
    ['data/questions/windows.json', '[]'],
    ['data/evidence/interviews.json', '[]'],
    ['questions.js', 'window.CPP_INTERVIEW_QUESTIONS = [];\n']
  ]);
  readText(path: string): string {
    const value = this.files.get(path);
    if (value === undefined) throw new Error(`Missing ${path}`);
    return value;
  }
  writeText(path: string, text: string): void { this.files.set(path, text); }
  writeBatch(files: ReadonlyMap<string, string>): void {
    files.forEach((text, path) => this.writeText(path, text));
  }
}

class MemoryConsole {
  readonly logs: string[] = [];
  readonly errors: string[] = [];
  log(message: string): void { this.logs.push(message); }
  error(message: string): void { this.errors.push(message); }
}

describe('CLI bootstrap', () => {
  it('defaults to check when argv is empty and keeps ports injected', () => {
    const fs = new MemoryFileSystem();
    const output = new MemoryConsole();

    expect(runCli([], fs, output)).toBe(0);
    expect(output.logs).toEqual(['{"ok":true,"questions":0}']);
  });

  it('accepts the argument separator forwarded by package scripts', () => {
    const fs = new MemoryFileSystem();
    const output = new MemoryConsole();

    expect(runCli(['--', 'stats'], fs, output)).toBe(0);
    expect(JSON.parse(output.logs[0]).totalQuestions).toBe(0);
  });
});
