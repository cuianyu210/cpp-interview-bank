import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { FilterState } from '../../src/domain/filter-state';
import { InMemoryQuestionRepository } from '../../src/infrastructure/in-memory-question-repository';
import { QuestionQueryService } from '../../src/application/question-query-service';

const makeQuestion = (id: string, answer: string, source: string): Question => ({
  id,
  group: 'cpp',
  category: 'cpp/core-language',
  title: `Title ${id}`,
  difficulty: 2,
  scopes: ['C++17'],
  answer,
  source
});

const withFilters = (id: string, overrides: Partial<Question>): Question => ({
  ...makeQuestion(id, 'Answer.', 'Source'),
  ...overrides
});

describe('QuestionQueryService', () => {
  it('trims and case-folds queries across answer and source text', () => {
    const questions = [
      makeQuestion('001', 'The collector reclaims unreachable objects.', 'Epic Games docs'),
      makeQuestion('002', 'An unrelated answer.', 'Microsoft Learn')
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({ query: '  MICROSOFT  ' }));

    expect(result.map((question) => question.id)).toEqual(['002']);
  });

  it('matches ASCII technical terms at identifier boundaries', () => {
    const questions = [
      withFilters('001', { title: 'ADL 如何扩展函数候选集？' }),
      withFilters('002', { title: 'LoadLibraryEx 如何选择 DLL 搜索路径？' })
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({ query: 'ADL' }));
    const prefixResult = service.query(new FilterState({ query: 'Load' }));

    expect(result.map((question) => question.id)).toEqual(['001']);
    expect(prefixResult.map((question) => question.id)).toEqual(['002']);
  });

  it('uses substring matching for natural Chinese queries containing spaces', () => {
    const questions = [
      withFilters('001', { title: '如何解释对象 生命周期与析构顺序？' }),
      withFilters('002', { title: '如何解释对象所有权转移？' })
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({ query: '对象 生命周期' }));

    expect(result.map((question) => question.id)).toEqual(['001']);
  });

  it('searches category text independently of title, answer, and source', () => {
    const questions = [
      withFilters('001', { category: 'cpp/templates-sfinae-traits-constexpr' }),
      withFilters('002', { category: 'cpp/core-language' })
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({ query: 'templates-sfinae' }));

    expect(result.map((question) => question.id)).toEqual(['001']);
  });

  it('searches scope text independently of title, answer, and source', () => {
    const questions = [
      withFilters('001', { scopes: ['C++20'] }),
      withFilters('002', { scopes: ['C++17'] })
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({ query: 'C++20' }));

    expect(result.map((question) => question.id)).toEqual(['001']);
  });

  it('applies difficulty, group, category, and scope filters together', () => {
    const questions = [
      withFilters('001', { difficulty: 3, group: 'ue5', category: 'ue5/reflection', scopes: ['UE5'] }),
      withFilters('002', { difficulty: 2, group: 'ue5', category: 'ue5/reflection', scopes: ['UE5'] }),
      withFilters('003', { difficulty: 3, group: 'cpp', category: 'cpp/reflection', scopes: ['C++17'] })
    ];
    const service = new QuestionQueryService(new InMemoryQuestionRepository(questions));

    const result = service.query(new FilterState({
      difficulty: 3,
      group: 'ue5',
      category: 'ue5/reflection',
      scope: 'UE5'
    }));

    expect(result.map((question) => question.id)).toEqual(['001']);
  });
});
