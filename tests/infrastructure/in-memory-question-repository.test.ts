import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { InMemoryQuestionRepository } from '../../src/infrastructure/in-memory-question-repository';

const question = (id: string): Question => ({
  id,
  group: 'cpp',
  category: 'cpp/core-language',
  title: `Question ${id}`,
  difficulty: 2,
  scopes: ['C++17'],
  answer: 'A concise answer.',
  source: 'cppreference'
});

describe('InMemoryQuestionRepository', () => {
  it('returns a stable collection and finds questions by id', () => {
    const first = question('001');
    const second = question('002');
    const repository = new InMemoryQuestionRepository([first, second]);

    expect(repository.findAll()).toEqual([first, second]);
    expect(repository.findById('002')).toBe(second);
    expect(repository.findById('missing')).toBeUndefined();
    expect(repository.findAll()).not.toBe(repository.findAll());
  });
});
