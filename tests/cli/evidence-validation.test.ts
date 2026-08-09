import { describe, expect, it } from 'vitest';
import { validateQuestionSet } from '../../tools/questions/question-tools';

const question = {
  id: '001', group: 'cpp' as const, category: 'cpp/lifetime-raii',
  title: 'RAII 如何绑定资源与对象生命周期？', difficulty: 1 as const,
  scopes: ['C++11', 'C++14', 'C++17'],
  answer: 'RAII 会把资源获取放在构造函数中，把资源释放放在析构函数中。这样即使异常让控制流提前离开作用域，已经构造完成的对象也会执行清理，资源所有权不会散落在多个分支里，接口语义也更清楚。',
  answerSources: [{ authority: 'cppreference' as const, topic: 'RAII' }],
  evidenceIds: ['e-1', 'e-2']
};
const evidence = [
  {
    id: 'e-1', company: 'Microsoft', role: 'C++ engineer',
    sourceTitle: 'Microsoft C++ interview experience',
    url: 'https://example.test/interview/123', accessedAt: '2026-08-08',
    reportedQuestion: 'Explain RAII.'
  },
  {
    id: 'e-2', company: 'Google', role: 'C++ engineer',
    sourceTitle: 'Google systems interview experience',
    url: 'https://example.test/interview/456', accessedAt: '2026-08-08',
    reportedQuestion: 'How does RAII manage resources?'
  }
];

describe('interview evidence validation', () => {
  it('rejects search or listing page URLs', () => {
    const searchPages = [
      'https://nowcoder.com/search?keyword=cpp',
      'https://www.nowcoder.com/search?query=cpp',
      'https://leetcode.cn/search?keyword=cpp',
      'https://example.test/interviews?search=cpp'
    ];

    for (const url of searchPages) {
      const report = validateQuestionSet([question], [{ ...evidence[0], url }, evidence[1]]);
      expect(report.errors).toContain('evidence e-1: search or listing page URLs are not allowed');
    }
  });

  it('allows ordinary detail-page query parameters', () => {
    const records = [
      { ...evidence[0], url: 'https://example.test/interview/123?from=feed&page=2' },
      evidence[1]
    ];
    expect(validateQuestionSet([question], records).errors).toEqual([]);
  });

  it('rejects exact duplicate URLs even when evidence ids differ', () => {
    const records = [evidence[0], { ...evidence[1], url: evidence[0].url }];
    const errors = validateQuestionSet([question], records).errors;
    expect(errors).toContain('evidence e-2: duplicate URL https://example.test/interview/123');
  });

  it('treats fragments and meaningless trailing slashes as the same page', () => {
    const records = [
      { ...evidence[0], url: 'https://EXAMPLE.test:443/interview/123/' },
      { ...evidence[1], url: 'https://example.test/interview/123#round-two' }
    ];
    const errors = validateQuestionSet([question], records).errors;

    expect(errors).toContain(
      'evidence e-2: duplicate URL https://example.test/interview/123#round-two'
    );
    expect(errors).toContain('001: evidence URLs must be independent');
  });

  it('removes tracking parameters and sorts identity-bearing query parameters', () => {
    const records = [
      {
        ...evidence[0],
        url: 'https://example.test/interview/123?utm_source=feed&from=search&lang=zh&page=2'
      },
      {
        ...evidence[1],
        url: 'https://example.test/interview/123?page=2&lang=zh&utm_medium=post&ref=home'
      }
    ];
    const errors = validateQuestionSet([question], records).errors;

    expect(errors.some((error) => error.startsWith('evidence e-2: duplicate URL'))).toBe(true);
    expect(errors).toContain('001: evidence URLs must be independent');
  });

  it('retains query parameters that can identify different content', () => {
    const records = [
      { ...evidence[0], url: 'https://example.test/interview/123?page=1&utm_source=feed' },
      { ...evidence[1], url: 'https://example.test/interview/123?page=2&utm_source=feed' }
    ];

    expect(validateQuestionSet([question], records).errors).toEqual([]);
  });

  it('rejects bare collections without rejecting known detail pages', () => {
    for (const url of ['https://example.test/interviews', 'https://example.test/questions/']) {
      const errors = validateQuestionSet([question], [{ ...evidence[0], url }, evidence[1]]).errors;
      expect(errors).toContain('evidence e-1: search or listing page URLs are not allowed');
    }

    const details = [
      { ...evidence[0], url: 'https://www.nowcoder.com/discuss/353156254812020736' },
      { ...evidence[1], url: 'https://leetcode.cn/discuss/post/3152349/tencent-interview/' }
    ];
    expect(validateQuestionSet([question], details).errors).toEqual([]);
  });

  it('allows collection routes only when a non-empty query parameter identifies the article', () => {
    const identityParameters = [
      'id=101',
      'articleId=102',
      'POSTID=103',
      'questionId=104',
      'interviewId=105',
      'detailId=106'
    ];
    for (const identity of identityParameters) {
      const records = [
        { ...evidence[0], url: `https://example.test/article?${identity}` },
        evidence[1]
      ];
      expect(validateQuestionSet([question], records).errors).toEqual([]);
    }

    for (const url of [
      'https://example.test/article?id=',
      'https://example.test/article?id=123&search=cpp'
    ]) {
      const errors = validateQuestionSet([question], [{ ...evidence[0], url }, evidence[1]]).errors;
      expect(errors).toContain('evidence e-1: search or listing page URLs are not allowed');
    }
  });

  it('keeps source query parameters because they can distinguish interview rounds', () => {
    const records = [
      { ...evidence[0], url: 'https://example.test/interview/123?source=round-one' },
      { ...evidence[1], url: 'https://example.test/interview/123?source=round-two' }
    ];

    expect(validateQuestionSet([question], records).errors).toEqual([]);
  });

  it('removes from and ref when a query identity turns a collection into a detail page', () => {
    const records = [
      { ...evidence[0], url: 'https://example.test/article?id=123&from=feed' },
      { ...evidence[1], url: 'https://example.test/article?ref=home&id=123' }
    ];
    const errors = validateQuestionSet([question], records).errors;

    expect(errors.some((error) => error.startsWith('evidence e-2: duplicate URL'))).toBe(true);
    expect(errors).toContain('001: evidence URLs must be independent');
  });

  it('rejects generic evidence titles and reported-question placeholders', () => {
    const genericTitles = [
      '常见 C++ 面试题整理',
      '常见 C++ 面试题整理。',
      '“常见 Ｃ＋＋ 面试题整理。”',
      '高频问题合集',
      'C++ questions'
    ];
    for (const sourceTitle of genericTitles) {
      const errors = validateQuestionSet(
        [question], [{ ...evidence[0], sourceTitle }, evidence[1]]
      ).errors;
      expect(errors).toContain('evidence e-1: generic source title is not allowed');
    }
  });

  it('rejects legacy search-record placeholders for every question group', () => {
    for (const group of ['C++', 'GoF', 'UE5', 'Windows']) {
      const records = [{
        ...evidence[0],
        sourceTitle: `公开 ${group} 面经检索记录`,
        reportedQuestion: `该岗位公开面试记录涉及 ${group} 的生命周期、边界和故障排查问题`
      }, evidence[1]];
      const errors = validateQuestionSet([question], records).errors;

      expect(errors).toContain('evidence e-1: generic source title is not allowed');
      expect(errors).toContain('evidence e-1: generic reported question is not allowed');
    }
  });
});
