import { describe, expect, it } from 'vitest';
import { QuestionCommandRunner } from '../../tools/questions/question-command-runner';

const question = {
  id: '001', group: 'cpp', category: 'cpp/lifetime-raii', title: 'RAII 如何管理资源？',
  difficulty: 2, scopes: ['C++11', 'C++14', 'C++17'],
  answer: 'RAII 会把资源绑定到对象生命周期中，由构造函数建立有效状态，并由析构函数负责释放资源。这样正常返回和异常展开都会走同一条清理路径，调用方不需要在每个分支里手写释放代码，所有权边界也更清楚。',
  answerSources: [{ authority: 'cppreference', topic: 'RAII' }], evidenceIds: ['e-1', 'e-2']
};
const evidence = [
  { id: 'e-1', company: 'Microsoft', role: 'C++ engineer', sourceTitle: 'One', url: 'https://example.test/one', accessedAt: '2026-08-08', reportedQuestion: 'RAII' },
  { id: 'e-2', company: 'Google', role: 'C++ engineer', sourceTitle: 'Two', url: 'https://example.test/two', accessedAt: '2026-08-08', reportedQuestion: 'RAII' }
];

class MemoryFileSystem {
  readonly files = new Map<string, string>([
    ['data/questions/cpp.json', JSON.stringify([question])],
    ['data/questions/gof.json', '[]'],
    ['data/questions/ue5.json', '[]'],
    ['data/evidence/interviews.json', JSON.stringify(evidence)],
    ['questions.js', 'stale']
  ]);
  readonly writes: Array<{ path: string; text: string }> = [];
  readText(path: string): string {
    const value = this.files.get(path);
    if (value === undefined) throw new Error(`Missing file ${path}`);
    return value;
  }
  writeText(path: string, text: string): void {
    this.writes.push({ path, text });
    this.files.set(path, text);
  }
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

function setup(): { runner: QuestionCommandRunner; fs: MemoryFileSystem; output: MemoryConsole } {
  const fs = new MemoryFileSystem();
  const output = new MemoryConsole();
  return { runner: new QuestionCommandRunner(fs, output), fs, output };
}

describe('question maintenance CLI build and check', () => {
  it('builds the runtime script and writes only questions.js', () => {
    const { runner, fs } = setup();

    expect(runner.run(['build'])).toBe(0);
    expect(fs.writes).toHaveLength(1);
    expect(fs.writes[0].path).toBe('questions.js');
    expect(fs.writes[0].text).toContain('window.CPP_INTERVIEW_QUESTIONS');
    expect(fs.writes[0].text).not.toContain('https://example.test');
    expect(fs.writes[0].text).not.toContain('e-1');
  });

  it('runs shared evidence validation before building', () => {
    const { runner, fs, output } = setup();
    fs.files.set('data/evidence/interviews.json', JSON.stringify([
      { ...evidence[0], sourceTitle: '公开 C++ 面经检索记录' },
      evidence[1]
    ]));

    expect(runner.run(['build'])).toBe(1);
    expect(fs.writes).toEqual([]);
    expect(output.errors).toContain('evidence e-1: generic source title is not allowed');
  });

  it('checks a current generated artifact and rejects a stale artifact without writing', () => {
    const { runner, fs, output } = setup();

    expect(runner.run(['build'])).toBe(0);
    fs.writes.length = 0;
    expect(runner.run(['check'])).toBe(0);
    expect(fs.writes).toEqual([]);
    expect(output.logs[1]).toContain('"ok":true');

    fs.files.set('questions.js', 'stale-again');
    expect(runner.run(['check'])).toBe(1);
    expect(fs.writes).toEqual([]);
  });
});
