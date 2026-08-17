import { describe, expect, it } from 'vitest';
import { QuestionCommandRunner } from '../../tools/questions/question-command-runner';

const initial = [
  {
    id: '001', group: 'cpp', category: 'cpp/lifetime-raii', title: 'RAII 如何管理资源？',
    difficulty: 2, scopes: ['C++11', 'C++14', 'C++17'],
    answer: 'RAII 会把资源绑定到对象生命周期中，由构造函数建立有效状态，并由析构函数负责释放资源。这样正常返回和异常展开都会走同一条清理路径，调用方不需要在每个分支里手写释放代码，所有权边界也更清楚。',
    answerSources: [{ authority: 'cppreference', topic: 'RAII' }], evidenceIds: ['e-1', 'e-2']
  },
  {
    id: '002', group: 'ue5', category: 'ue5/uobject-reflection-gc', title: 'UObject 如何参与 GC？',
    difficulty: 3, scopes: ['UE5'],
    answer: '反射系统会记录 UObject 之间可被追踪的引用，GC 再从根集合出发分析对象可达性。只有仍然可达的对象会被保留，所以裸指针引用不能替代可被反射系统识别的属性，生命周期也要交给引擎规则管理。',
    answerSources: [{ authority: 'epic-games', topic: 'Garbage Collection' }], evidenceIds: ['e-1', 'e-2']
  }
];
const baseEvidence = [
  { id: 'e-1', company: 'Microsoft', role: 'C++ engineer', sourceTitle: 'One', url: 'https://example.test/one', accessedAt: '2026-08-08', reportedQuestion: 'RAII' },
  { id: 'e-2', company: 'Epic Games', role: 'Engine engineer', sourceTitle: 'Two', url: 'https://example.test/two', accessedAt: '2026-08-08', reportedQuestion: 'GC' }
];
const extraEvidence = [
  { id: 'e-3', company: 'Tencent', role: 'Windows engineer', sourceTitle: 'Three', url: 'https://example.test/three', accessedAt: '2026-08-08', reportedQuestion: 'Handles' },
  { id: 'e-4', company: 'Huawei', role: 'Windows engineer', sourceTitle: 'Four', url: 'https://example.test/four', accessedAt: '2026-08-08', reportedQuestion: 'Processes' }
];

class MemoryFileSystem {
  readonly files = new Map<string, string>([
    ['data/questions/cpp.json', JSON.stringify([initial[0]])],
    ['data/questions/gof.json', '[]'],
    ['data/questions/ue5.json', JSON.stringify([initial[1]])],
    ['data/evidence/interviews.json', JSON.stringify(baseEvidence)],
    ['questions.js', 'old-runtime']
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

describe('question maintenance CLI apply', () => {
  it('applies evidence and question changes atomically with the next id', () => {
    const { runner, fs } = setup();
    fs.files.set('patch.json', JSON.stringify({
      evidence: extraEvidence,
      changes: [
        { action: 'update', id: '001', patch: { difficulty: 4 } },
        {
          action: 'add',
          question: {
            group: 'ue5', category: 'ue5/actor-component-subsystem',
            title: 'Actor 生成时所有者和发起者怎么设置？', difficulty: 3, scopes: ['UE5'],
            answer: '生成 Actor 时需要明确所有者和发起者，所有者负责生命周期管理，发起者记录触发行为的源头。两者设置错误会导致网络复制和伤害归属判断异常。',
            answerSources: [{ authority: 'epic-games', topic: 'Actor Spawning' }],
            evidenceIds: ['e-3', 'e-4']
          }
        },
        { action: 'delete', id: '002' }
      ]
    }));

    expect(runner.run(['apply', '--file', 'patch.json'])).toBe(0);
    expect(fs.writes).toHaveLength(5);
    expect(JSON.parse(fs.files.get('data/questions/cpp.json') ?? '[]')[0].difficulty).toBe(4);
    expect(JSON.parse(fs.files.get('data/questions/ue5.json') ?? '[]').length).toBe(1);
    expect(fs.files.get('questions.js')).not.toBe('old-runtime');
    expect(fs.files.get('questions.js')).not.toContain('https://example.test');
  });

  it('supports dry-run without writing any target file', () => {
    const { runner, fs, output } = setup();
    fs.files.set('patch.json', JSON.stringify({ changes: [{ action: 'delete', id: '002' }] }));

    expect(runner.run(['apply', '--file', 'patch.json', '--dry-run'])).toBe(0);
    expect(fs.writes).toEqual([]);
    expect(output.logs[0]).toContain('"dryRun":true');
  });

  it('keeps stable ids after deletion and allocates additions after the global maximum', () => {
    const { runner, fs, output } = setup();
    fs.files.set('data/questions/ue5.json', JSON.stringify([
      initial[1],
      {
      id: '010', group: 'ue5', category: 'ue5/actor-component-subsystem',
      title: 'Actor 销毁时的清理顺序是怎样的？', difficulty: 2, scopes: ['UE5'],
      answer: 'Actor 销毁时先调用 EndPlay 停止运行逻辑，再调用 OnDestroyed 清理事件绑定，最后析构函数释放资源。必须按顺序清理，否则可能访问已销毁的对象。',
      answerSources: [{ authority: 'epic-games', topic: 'Actor Destruction' }],
      evidenceIds: ['e-1', 'e-2']
    }]));
    fs.files.set('patch.json', JSON.stringify({
      evidence: extraEvidence,
      changes: [
        { action: 'delete', id: '002' },
        {
          action: 'add',
          question: {
            group: 'cpp', category: 'cpp/lifetime-raii',
            title: '智能指针如何表达独占所有权？', difficulty: 2, scopes: ['C++11'],
            answer: 'std::unique_ptr 表达独占所有权，同一时刻只有一个对象负责释放被管理资源。移动操作可以转移所有权，源指针随后进入可析构、可赋值但不应继续解引用的状态，这让接口的所有权语义更明确。',
            answerSources: [{ authority: 'cppreference', topic: 'std::unique_ptr' }],
            evidenceIds: ['e-3', 'e-4']
          }
        },
        {
          action: 'add',
          question: {
            group: 'ue5', category: 'ue5/uobject-reflection-gc',
            title: 'UPROPERTY 如何帮助垃圾回收跟踪引用？', difficulty: 2, scopes: ['UE5'],
            answer: 'UPROPERTY 会让反射系统记录 UObject 引用，使垃圾回收可以从根集合继续追踪这些对象。可达性分析据此保留仍被引用的对象，而普通裸指针不会自动提供这种保护，生命周期也不能绕开引擎规则。',
            answerSources: [{ authority: 'epic-games', topic: 'Unreal Object Handling' }],
            evidenceIds: ['e-3', 'e-4']
          }
        }
      ]
    }));

    expect(runner.run(['apply', '--file', 'patch.json'])).toBe(0);
    const ids = ['cpp', 'gof', 'ue5'].flatMap((group) => (
      JSON.parse(fs.files.get(`data/questions/${group}.json`) ?? '[]')
        .map((question: { id: string }) => question.id)
    ));
    expect(ids.sort()).toEqual(['001', '010', '011', '012']);
    expect(fs.writes).toHaveLength(5);
    expect(output.logs).toContain(
      JSON.stringify({ dryRun: false, added: 2, updated: 0, deleted: 1, evidenceAdded: 2 })
    );
  });

  it('leaves every file untouched when validation fails', () => {
    const { runner, fs } = setup();
    const before = new Map(fs.files);
    fs.files.set('patch.json', JSON.stringify({
      changes: [{ action: 'update', id: '001', patch: { difficulty: 9 } }]
    }));

    expect(runner.run(['apply', '--file', 'patch.json'])).toBe(1);
    expect(fs.writes).toEqual([]);
    expect(fs.files.get('questions.js')).toBe(before.get('questions.js'));
  });

  it('rejects an update patch that attempts to change a stable id', () => {
    const { runner, fs, output } = setup();
    const before = new Map(fs.files);
    fs.files.set('patch.json', JSON.stringify({
      changes: [{ action: 'update', id: '001', patch: { id: '777', difficulty: 4 } }]
    }));

    expect(runner.run(['apply', '--file', 'patch.json'])).toBe(1);
    expect(output.errors).toContain('Update patch must not modify the stable id');
    expect(fs.writes).toEqual([]);
    expect(fs.files.get('data/questions/cpp.json')).toBe(before.get('data/questions/cpp.json'));
  });
});
