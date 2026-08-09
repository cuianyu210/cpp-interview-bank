import { describe, expect, it } from 'vitest';
import {
  QuestionDataStore,
  type FileSystemPort
} from '../../tools/questions/question-store';

const validQuestion = {
  id: '001', group: 'cpp', category: 'cpp/lifetime-raii', title: 'RAII 如何管理资源？',
  difficulty: 1, scopes: ['C++11'],
  answer: '资源绑定对象生命周期。析构时完成释放。',
  answerSources: [{ authority: 'cppreference', topic: 'RAII' }], evidenceIds: ['e-1', 'e-2']
};

const evidence = [
  { id: 'e-1', company: 'Microsoft', role: 'C++ engineer', sourceTitle: 'One', url: 'https://example.test/one', accessedAt: '2026-08-08', reportedQuestion: 'RAII' },
  { id: 'e-2', company: 'Google', role: 'C++ engineer', sourceTitle: 'Two', url: 'https://example.test/two', accessedAt: '2026-08-08', reportedQuestion: 'RAII lifetime' }
];

describe('QuestionDataStore', () => {
  it('rejects a question stored in a file for a different group', () => {
    const files = new Map<string, string>([
      ['data/questions/cpp.json', JSON.stringify([{ ...validQuestion, group: 'ue5' }])],
      ['data/questions/gof.json', '[]'],
      ['data/questions/ue5.json', '[]'],
      ['data/questions/windows.json', '[]'],
      ['data/evidence/interviews.json', JSON.stringify(evidence)],
      ['questions.js', '']
    ]);
    const store = new QuestionDataStore({
      readText(path) {
        const text = files.get(path);
        if (text === undefined) throw new Error(`Missing ${path}`);
        return text;
      },
      writeText() {},
      writeBatch() {}
    });

    expect(() => store.load()).toThrow(
      'data/questions/cpp.json: expected group cpp but found ue5 for question 001'
    );
  });

  it('locates invalid question schemas by source file and record number', () => {
    const files = validFiles([{ ...validQuestion, difficulty: 9 }], evidence);
    const store = storeFor(files);

    expect(() => store.load()).toThrow('data/questions/cpp.json record 1:');
  });

  it('locates invalid evidence schemas by source file and record number', () => {
    const invalidEvidence = [evidence[0], { ...evidence[1], accessedAt: 'not-a-date' }];
    const store = storeFor(validFiles([validQuestion], invalidEvidence));

    expect(() => store.load()).toThrow('data/evidence/interviews.json record 2:');
  });

  it('does not silently fall back to partial individual writes', () => {
    const files = new Map([
      ['one.json', 'old-one'],
      ['two.json', 'old-two']
    ]);
    const before = new Map(files);
    let writes = 0;
    const legacyFileSystem = {
      readText(path: string) { return files.get(path) ?? ''; },
      writeText(path: string, text: string) {
        writes += 1;
        if (writes === 2) throw new Error('simulated write failure');
        files.set(path, text);
      }
    } as unknown as FileSystemPort;
    const store = new QuestionDataStore(legacyFileSystem);

    expect(() => store.write(new Map([
      ['one.json', 'new-one'],
      ['two.json', 'new-two']
    ]))).toThrow();
    expect(files).toEqual(before);
  });
});

function validFiles(questions: readonly unknown[], records: readonly unknown[]): Map<string, string> {
  return new Map([
    ['data/questions/cpp.json', JSON.stringify(questions)],
    ['data/questions/gof.json', '[]'],
    ['data/questions/ue5.json', '[]'],
    ['data/questions/windows.json', '[]'],
    ['data/evidence/interviews.json', JSON.stringify(records)],
    ['questions.js', '']
  ]);
}

function storeFor(files: ReadonlyMap<string, string>): QuestionDataStore {
  return new QuestionDataStore({
    readText(path) {
      const text = files.get(path);
      if (text === undefined) throw new Error(`Missing ${path}`);
      return text;
    },
    writeText() {},
    writeBatch() {}
  });
}
