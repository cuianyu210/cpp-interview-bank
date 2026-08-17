import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { StudyPathSortStrategy } from '../../src/application/sort-strategy';
import { categoryLabel, sortCategoriesByStudyPath } from '../../src/application/question-taxonomy';

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
      makeQuestion('10', 1, 'ue5', 'ue5/actor-component-subsystem'),
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

  it('places the UE5 XR and VR category after the core engine categories', () => {
    expect(categoryLabel('ue5/xr-vr')).toBe('XR/VR 交互与性能');
    expect(sortCategoriesByStudyPath('ue5', [
      'ue5/xr-vr',
      'ue5/uobject-reflection-gc',
      'ue5/modules-plugins-buildcs'
    ])).toEqual([
      'ue5/uobject-reflection-gc',
      'ue5/modules-plugins-buildcs',
      'ue5/xr-vr'
    ]);
  });
});
