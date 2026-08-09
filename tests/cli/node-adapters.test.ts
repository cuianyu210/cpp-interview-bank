import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NodeFileSystem } from '../../tools/questions/node-adapters';

const roots: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('NodeFileSystem batch writes', () => {
  it('replaces a complete batch only after every file has been staged', () => {
    const root = makeRoot();
    writeFileSync(join(root, 'one.txt'), 'old-one');
    writeFileSync(join(root, 'two.txt'), 'old-two');
    const fileSystem = new NodeFileSystem(root) as NodeFileSystem & BatchWriter;

    fileSystem.writeBatch(new Map([
      ['one.txt', 'new-one'],
      ['two.txt', 'new-two']
    ]));

    expect(readFileSync(join(root, 'one.txt'), 'utf8')).toBe('new-one');
    expect(readFileSync(join(root, 'two.txt'), 'utf8')).toBe('new-two');
    expect(readdirSync(root).sort()).toEqual(['one.txt', 'two.txt']);
  });

  it('leaves existing targets untouched when staging any file fails', () => {
    const root = makeRoot();
    writeFileSync(join(root, 'one.txt'), 'old-one');
    const fileSystem = new NodeFileSystem(root) as NodeFileSystem & BatchWriter;

    expect(() => fileSystem.writeBatch(new Map([
      ['one.txt', 'new-one'],
      ['missing/two.txt', 'new-two']
    ]))).toThrow();

    expect(readFileSync(join(root, 'one.txt'), 'utf8')).toBe('old-one');
    expect(existsSync(join(root, 'missing', 'two.txt'))).toBe(false);
    expect(readdirSync(root)).toEqual(['one.txt']);
  });

  it('restores all authoring and runtime files when installation fails midway', () => {
    const root = makeRoot();
    const now = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    mkdirSync(join(root, 'data', 'questions'), { recursive: true });
    mkdirSync(join(root, 'data', 'evidence'), { recursive: true });
    const paths = [
      'data/questions/cpp.json',
      'data/questions/gof.json',
      'data/questions/ue5.json',
      'data/questions/windows.json',
      'data/evidence/interviews.json',
      'questions.js'
    ];
    paths.forEach((path, index) => writeFileSync(join(root, path), `old-${index}`));
    const blocker = join(root, `${paths[5]}.codex-backup-${process.pid}-${now}-5`);
    mkdirSync(blocker);
    writeFileSync(join(blocker, 'keep.txt'), 'block backup rename');
    const fileSystem = new NodeFileSystem(root);

    expect(() => fileSystem.writeBatch(new Map(
      paths.map((path, index) => [path, `new-${index}`])
    ))).toThrow();

    paths.forEach((path, index) => {
      expect(readFileSync(join(root, path), 'utf8')).toBe(`old-${index}`);
    });
  });
});

interface BatchWriter {
  writeBatch(files: ReadonlyMap<string, string>): void;
}

function makeRoot(): string {
  const root = join(tmpdir(), `cpp-interview-bank-${process.pid}-${Date.now()}-${roots.length}`);
  mkdirSync(root, { recursive: false });
  roots.push(root);
  return root;
}
