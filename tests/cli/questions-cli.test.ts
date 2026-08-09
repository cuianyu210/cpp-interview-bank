import { describe, expect, it } from 'vitest';
import { QuestionCommandRunner } from '../../tools/questions/question-command-runner';

const source = { authority: 'cppreference', topic: 'RAII' };
const questions = [
  {
    id: '001', group: 'cpp', category: 'cpp/lifetime-raii',
    title: 'RAII 如何管理资源？', difficulty: 2,
    scopes: ['C++11', 'C++14', 'C++17'],
    answer: '资源绑定对象生命周期。析构函数负责释放资源。',
    answerSources: [source], evidenceIds: ['e-1', 'e-2']
  },
  {
    id: '002', group: 'ue5', category: 'ue5/uobject-reflection-gc',
    title: 'UObject 如何参与 GC？', difficulty: 3, scopes: ['UE5'],
    answer: '反射系统记录引用。GC 从根集合分析可达性。',
    answerSources: [{ authority: 'epic-games', topic: 'Garbage Collection' }],
    evidenceIds: ['e-1', 'e-2']
  }
];
const evidence = [
  {
    id: 'e-1', company: 'Microsoft', role: 'C++ engineer',
    sourceTitle: 'Interview one', url: 'https://example.test/one',
    accessedAt: '2026-08-08', reportedQuestion: 'Explain RAII.'
  },
  {
    id: 'e-2', company: 'Epic Games', role: 'Engine engineer',
    sourceTitle: 'Interview two', url: 'https://example.test/two',
    accessedAt: '2026-08-08', reportedQuestion: 'Explain object lifetime.'
  }
];

class MemoryFileSystem {
  readonly files = new Map<string, string>([
    ['data/questions/cpp.json', JSON.stringify([questions[0]])],
    ['data/questions/gof.json', '[]'],
    ['data/questions/ue5.json', JSON.stringify([questions[1]])],
    ['data/questions/windows.json', '[]'],
    ['data/evidence/interviews.json', JSON.stringify(evidence)],
    ['questions.js', 'stale']
  ]);
  readonly writes: Array<{ path: string; text: string }> = [];

  readText(path: string): string {
    const text = this.files.get(path);
    if (text === undefined) throw new Error(`Missing file ${path}`);
    return text;
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

function setup(): {
  runner: QuestionCommandRunner;
  fileSystem: MemoryFileSystem;
  output: MemoryConsole;
} {
  const fileSystem = new MemoryFileSystem();
  const output = new MemoryConsole();
  return { runner: new QuestionCommandRunner(fileSystem, output), fileSystem, output };
}

describe('question maintenance CLI search and evidence', () => {
  it('searches by query and prints only the default summary fields', () => {
    const { runner, output } = setup();

    expect(runner.run(['search', '--query', 'RAII'])).toBe(0);
    const result = JSON.parse(output.logs[0]) as Array<Record<string, unknown>>;

    expect(result).toEqual([{
      id: '001', title: 'RAII 如何管理资源？', category: 'cpp/lifetime-raii',
      difficulty: 2, evidenceCount: 2,
      answerSources: ['cppreference · RAII']
    }]);
    expect(result[0]).not.toHaveProperty('answer');
    expect(result[0]).not.toHaveProperty('evidenceIds');
  });

  it('does not match an ASCII term inside a longer identifier', () => {
    const { runner, fileSystem, output } = setup();
    fileSystem.files.set('data/questions/windows.json', JSON.stringify([{
      id: '003', group: 'windows', category: 'windows/dll-files-mmap-unicode-handles',
      title: 'LoadLibraryEx 如何选择 DLL 搜索路径？', difficulty: 3, scopes: ['Win32'],
      answer: '调用方选择受控搜索目录。安全标志可以降低 DLL 劫持风险。',
      answerSources: [{ authority: 'microsoft-learn', topic: 'LoadLibraryEx' }],
      evidenceIds: ['e-1', 'e-2']
    }]));

    expect(runner.run(['search', '--query', 'ADL'])).toBe(0);
    expect(JSON.parse(output.logs[0])).toEqual([]);
  });

  it('filters by group and category and supports full maintenance output', () => {
    const { runner, output } = setup();

    expect(runner.run([
      'search', '--group', 'ue5', '--category', 'ue5/uobject-reflection-gc', '--full'
    ])).toBe(0);
    const result = JSON.parse(output.logs[0]) as Array<Record<string, unknown>>;

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: '002', answer: questions[1].answer });
    expect(result[0]).toHaveProperty('evidenceIds', ['e-1', 'e-2']);
  });

  it('shows evidence URLs only through the maintenance evidence command', () => {
    const { runner, output } = setup();

    expect(runner.run(['evidence', '--id', '001'])).toBe(0);
    const result = JSON.parse(output.logs[0]) as Array<Record<string, unknown>>;

    expect(result.map((row) => row.id)).toEqual(['e-1', 'e-2']);
    expect(result[0].url).toBe('https://example.test/one');
  });

  it('runs shared evidence validation before serving search results', () => {
    const { runner, fileSystem, output } = setup();
    fileSystem.files.set('data/evidence/interviews.json', JSON.stringify([
      { ...evidence[0], url: 'https://www.nowcoder.com/search?keyword=cpp' },
      evidence[1]
    ]));

    expect(runner.run(['search', '--query', 'RAII'])).toBe(1);
    expect(output.errors).toContain('evidence e-1: search or listing page URLs are not allowed');
  });

  it('reports the evidence source location when schema parsing fails', () => {
    const { runner, fileSystem, output } = setup();
    fileSystem.files.set('data/evidence/interviews.json', JSON.stringify([
      { ...evidence[0], accessedAt: 'invalid-date' },
      evidence[1]
    ]));

    expect(runner.run(['search', '--query', 'RAII'])).toBe(1);
    expect(output.errors[0]).toContain('data/evidence/interviews.json record 1:');
  });
});

describe('question maintenance CLI stats', () => {
  it('reports coverage plus question, evidence, company, group, difficulty, and authority counts', () => {
    const { runner, output } = setup();

    expect(runner.run(['stats'])).toBe(0);
    const result = JSON.parse(output.logs[0]) as Record<string, unknown>;

    expect(result).toEqual({
      totalQuestions: 2,
      evidenceRecords: 2,
      evidenceCoverage: { covered: 2, total: 2, percent: 100 },
      companies: { Microsoft: 1, 'Epic Games': 1 },
      groups: { cpp: 1, ue5: 1 },
      categories: { 'cpp/lifetime-raii': 1, 'ue5/uobject-reflection-gc': 1 },
      difficulties: { '2': 1, '3': 1 },
      authorities: { cppreference: 1, 'epic-games': 1 }
    });
  });
});

export { MemoryConsole, MemoryFileSystem, evidence, questions, setup };
