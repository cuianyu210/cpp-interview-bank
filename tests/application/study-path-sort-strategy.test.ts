import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { StudyPathSortStrategy } from '../../src/application/sort-strategy';

const makeQuestion = (
  id: string,
  difficulty: Question['difficulty'],
  group: Question['group'],
  category: string
): Question => ({
  id,
  group,
  category,
  title: `${group}-${id}`,
  difficulty,
  scopes: ['C++17'],
  answer: 'Answer.',
  source: 'test'
});

describe('StudyPathSortStrategy', () => {
  it('sorts by study path, then difficulty, then numeric id without mutating input', () => {
    const input = [
      makeQuestion('10', 1, 'windows', 'windows/process-thread-sync'),
      makeQuestion('2', 5, 'cpp', 'cpp/core-language'),
      makeQuestion('1', 1, 'cpp', 'cpp/core-language'),
      makeQuestion('20', 2, 'cpp', 'cpp/classes-object-model'),
      makeQuestion('3', 1, 'cpp', 'cpp/stl'),
      makeQuestion('4', 1, 'gof', 'gof/creation')
    ];
    const original = [...input];

    const result = new StudyPathSortStrategy().sort(input);

    expect(result.map((question) => question.id)).toEqual(['1', '2', '20', '3', '4', '10']);
    expect(input).toEqual(original);
    expect(result).not.toBe(input);
  });
});
