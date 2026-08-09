import { describe, expect, it } from 'vitest';
import {
  applyQuestionChanges,
  buildRuntimeScript,
  validateQuestionSet,
  type QuestionChange
} from '../../tools/questions/question-tools';

const source = { authority: 'cppreference' as const, topic: 'RAII' };
const evidence = [
  {
    id: 'e-1',
    company: 'Microsoft',
    role: 'C++ engineer',
    sourceTitle: 'C++ interview experience',
    url: 'https://example.test/microsoft-cpp',
    accessedAt: '2026-08-08',
    reportedQuestion: 'Explain RAII.'
  },
  {
    id: 'e-2',
    company: 'Google',
    role: 'C++ engineer',
    sourceTitle: 'Systems interview experience',
    url: 'https://example.test/google-cpp',
    accessedAt: '2026-08-08',
    reportedQuestion: 'How does RAII manage resources?'
  }
];
const question = {
  id: '001',
  group: 'cpp' as const,
  category: 'cpp/lifetime-raii',
  title: 'RAII 如何绑定资源与对象生命周期？',
  difficulty: 1 as const,
  scopes: ['C++11', 'C++14', 'C++17'],
  answer: '构造函数取得资源，析构函数释放资源。这样即使异常离开作用域也会执行清理。',
  answerSources: [source],
  evidenceIds: ['e-1', 'e-2']
};

describe('question maintenance tools', () => {
  it('accepts a valid set and reports group statistics', () => {
    const report = validateQuestionSet([question], evidence);

    expect(report.errors).toEqual([]);
    expect(report.counts).toEqual({ cpp: 1 });
  });

  it('rejects a missing second evidence record before writing', () => {
    const report = validateQuestionSet([{ ...question, evidenceIds: ['e-1'] }], evidence);

    expect(report.errors.some((error) => error.includes('two independent'))).toBe(true);
  });

  it('rejects answer authorities outside the group allowlist and source URLs', () => {
    const wrongAuthority = {
      ...question,
      answerSources: [{ authority: 'epic-games' as const, topic: 'Gameplay Architecture' }]
    };
    const sourceUrl = {
      ...question,
      answerSources: [{ ...source, url: 'https://en.cppreference.com/w/cpp/language/raii' }]
    };

    expect(validateQuestionSet([wrongAuthority], evidence).errors)
      .toContain('001: epic-games is not an authoritative answer source for cpp');
    expect(validateQuestionSet([sourceUrl], evidence).errors)
      .toContain('001: answer source URLs and locators are not allowed');
  });

  it('rejects generated prompts, coaching answers, and answers outside two to five sentences', () => {
    const generated = {
      ...question,
      title: 'RAII 在编译、链接和运行时分别由哪些规则决定？',
      answer: '先说明定义。回答中应覆盖成功路径。'
    };
    const oneSentence = { ...question, answer: 'RAII 把资源释放绑定到对象析构。' };

    const generatedErrors = validateQuestionSet([generated], evidence).errors;
    expect(generatedErrors).toContain('001: generated or coaching phrasing is not allowed');
    expect(validateQuestionSet([oneSentence], evidence).errors)
      .toContain('001: answer must contain between two and five sentences');
  });

  it('rejects duplicate stable ids even when question text differs', () => {
    const duplicateId = {
      ...question,
      title: '析构函数如何完成资源清理？',
      answer: '析构函数释放对象拥有的资源。作用域结束和异常展开都会触发析构。'
    };

    expect(validateQuestionSet([question, duplicateId], evidence).errors)
      .toContain('001: duplicate question id');
  });

  it('keeps pattern metadata exclusive to GoF questions and ids sortable', () => {
    const cppPattern = { ...question, pattern: 'Singleton' };
    const gofWithoutPattern = {
      ...question,
      id: '151',
      group: 'gof',
      category: 'gof/creation',
      answerSources: [{ authority: 'gof', topic: 'Factory Method intent' }]
    };
    const invalidId = { ...question, id: 'new-question' };

    expect(validateQuestionSet([cppPattern], evidence).errors)
      .toContain('001: pattern is only allowed for GoF questions');
    expect(validateQuestionSet([gofWithoutPattern], evidence).errors)
      .toContain('151: GoF questions require a pattern');
    expect(validateQuestionSet([invalidId], evidence).errors)
      .toContain('new-question: question id must contain at least three digits');
  });

  it('applies add, update, and delete changes without mutating the input', () => {
    const changes: QuestionChange[] = [
      { action: 'update', id: '001', patch: { difficulty: 2 } },
      { action: 'add', question: { ...question, id: '002', title: '移动构造的源对象何时失效？' } },
      { action: 'delete', id: '001' }
    ];

    const result = applyQuestionChanges([question], changes);

    expect(result.map((item) => item.id)).toEqual(['002']);
    expect(result[0].difficulty).toBe(1);
    expect(question.id).toBe('001');
  });

  it('builds runtime data without maintenance evidence or URLs', () => {
    const script = buildRuntimeScript([question], evidence);

    expect(script).toContain('window.CPP_INTERVIEW_QUESTIONS');
    expect(script).toContain('资料依据：cppreference · RAII');
    expect(script).not.toContain('https://example.test');
    expect(script).not.toContain('e-1');
  });

  it('renders authority identifiers as readable source names', () => {
    const sourcedQuestion = {
      ...question,
      answerSources: [
        { authority: 'cpp-core-guidelines' as const, topic: 'R.1 Manage resources automatically' },
        { authority: 'wg21' as const, topic: 'C++ working draft object lifetime' }
      ]
    };

    const script = buildRuntimeScript([sourcedQuestion], evidence);

    expect(script).toContain('C++ Core Guidelines · R.1 Manage resources automatically');
    expect(script).toContain('WG21 · C++ working draft object lifetime');
    expect(script).not.toContain('cpp-core-guidelines ·');
  });
});
