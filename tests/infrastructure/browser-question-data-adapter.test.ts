import { describe, expect, it } from 'vitest';
import { BrowserQuestionDataAdapter } from '../../src/infrastructure/browser-question-data-adapter';

describe('BrowserQuestionDataAdapter', () => {
  it('maps window questions to runtime fields without evidence metadata', () => {
    const adapter = new BrowserQuestionDataAdapter({
      CPP_INTERVIEW_QUESTIONS: [{
        id: '001',
        group: 'cpp',
        category: 'cpp/core-language',
        title: '题目？',
        difficulty: 3,
        scopes: ['C++17'],
        pattern: '  RAII  ',
        answer: '回答。',
        source: '来源文字',
        company: 'Hidden',
        evidenceIds: ['e-1', 'e-2'],
        url: 'https://example.test/private'
      }]
    });

    const result = adapter.load();

    expect(result).toEqual([{
      id: '001',
      group: 'cpp',
      category: 'cpp/core-language',
      title: '题目？',
      difficulty: 3,
      scopes: ['C++17'],
      pattern: 'RAII',
      answer: '回答。',
      source: '来源文字'
    }]);
    expect(JSON.stringify(result)).not.toContain('Hidden');
    expect(JSON.stringify(result)).not.toContain('https://');
  });

  it('drops rows that are missing required runtime text fields', () => {
    const base = {
      id: '001',
      group: 'cpp',
      category: 'cpp/core-language',
      title: 'Question',
      difficulty: 3,
      scopes: ['C++17'],
      answer: 'Answer.',
      source: 'cppreference'
    };
    const adapter = new BrowserQuestionDataAdapter({
      CPP_INTERVIEW_QUESTIONS: [
        { ...base, id: ' ' },
        { ...base, title: undefined },
        { ...base, answer: '' },
        { ...base, source: 'https://example.test/private' }
      ]
    });

    expect(adapter.load()).toEqual([]);
  });
});
