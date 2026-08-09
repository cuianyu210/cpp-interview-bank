import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { QuestionCommandRunner } from '../../tools/questions/question-command-runner';

const generatedPaths = [
  'data/questions/cpp.json',
  'data/questions/gof.json',
  'data/questions/ue5.json',
  'data/questions/windows.json',
  'data/evidence/interviews.json',
  'questions.js'
] as const;

class FailingMemoryFileSystem {
  readonly files = new Map<string, string>();
  readonly writes: string[] = [];
  failAtWrite = Number.POSITIVE_INFINITY;

  constructor() {
    generatedPaths.forEach((path) => {
      this.files.set(path, readFileSync(resolve(path), 'utf8'));
    });
  }

  readText(path: string): string {
    const value = this.files.get(path);
    if (value === undefined) throw new Error(`Missing ${path}`);
    return value;
  }

  writeText(path: string, text: string): void {
    this.writes.push(path);
    if (this.writes.length === this.failAtWrite) {
      throw new Error('simulated install failure');
    }
    this.files.set(path, text);
  }

  writeBatch(files: ReadonlyMap<string, string>): void {
    const before = new Map(this.files);
    try {
      files.forEach((text, path) => this.writeText(path, text));
    } catch (error) {
      this.files.clear();
      before.forEach((text, path) => this.files.set(path, text));
      throw error;
    }
  }
}

class MemoryConsole {
  readonly logs: string[] = [];
  readonly errors: string[] = [];
  log(message: string): void { this.logs.push(message); }
  error(message: string): void { this.errors.push(message); }
}

describe('question apply atomicity', () => {
  it('restores every generated file when a batch fails during installation', () => {
    const fs = new FailingMemoryFileSystem();
    const output = new MemoryConsole();
    const cpp = JSON.parse(fs.files.get(generatedPaths[0]) ?? '[]') as Array<{
      id: string;
      difficulty: number;
    }>;
    const difficulty = cpp[0].difficulty === 5 ? 4 : cpp[0].difficulty + 1;
    fs.files.set('patch.json', JSON.stringify({
      changes: [{ action: 'update', id: cpp[0].id, patch: { difficulty } }]
    }));
    const before = new Map(fs.files);
    fs.failAtWrite = generatedPaths.length;

    expect(new QuestionCommandRunner(fs, output).run(['apply', '--file', 'patch.json'])).toBe(1);
    expect(output.errors).toContain('simulated install failure');
    expect(fs.files).toEqual(before);
  });

  it('includes the patch file path when its JSON cannot be parsed', () => {
    const fs = new FailingMemoryFileSystem();
    const output = new MemoryConsole();
    fs.files.set('broken-patch.json', '{"changes": [');

    expect(new QuestionCommandRunner(fs, output).run([
      'apply', '--file', 'broken-patch.json'
    ])).toBe(1);
    expect(output.errors[0]).toContain('broken-patch.json');
  });
});
