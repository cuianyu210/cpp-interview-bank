import { Difficulty, type DifficultyValue } from './difficulty';
import type { QuestionGroup } from './question';

const questionGroups = new Set<QuestionGroup>(['cpp', 'gof', 'ue5', 'windows']);

export interface FilterStateValues {
  readonly query: string;
  readonly scope: string;
  readonly difficulty: DifficultyValue | null;
  readonly group: QuestionGroup | '';
  readonly category: string;
}

export type FilterStatePatch = Partial<FilterStateValues>;

export class FilterState implements FilterStateValues {
  readonly query: string;
  readonly scope: string;
  readonly difficulty: DifficultyValue | null;
  readonly group: QuestionGroup | '';
  readonly category: string;

  constructor(values: FilterStatePatch = {}) {
    const selection = normalizeSelection(values.group ?? '', values.category ?? '');
    this.query = values.query ?? '';
    this.scope = values.scope ?? '';
    this.difficulty = values.difficulty == null
      ? null
      : Difficulty.from(values.difficulty).value;
    this.group = selection.group;
    this.category = selection.category;
    Object.freeze(this);
  }

  with(patch: FilterStatePatch): FilterState {
    const selection = patchSelection(this, patch);
    return new FilterState({
      query: patch.query ?? this.query,
      scope: patch.scope ?? this.scope,
      difficulty: patch.difficulty === undefined ? this.difficulty : patch.difficulty,
      ...selection
    });
  }
}

function patchSelection(
  current: FilterState,
  patch: FilterStatePatch
): Pick<FilterStateValues, 'group' | 'category'> {
  let group = patch.group ?? current.group;
  let category = patch.category ?? current.category;
  if (patch.group !== undefined && patch.category === undefined) category = '';
  if (patch.category && patch.group === undefined) group = '';
  return { group, category };
}

function normalizeSelection(
  group: QuestionGroup | '',
  categoryValue: string
): Pick<FilterStateValues, 'group' | 'category'> {
  const category = categoryValue.trim();
  if (!category) return { group, category: '' };
  const separator = category.indexOf('/');
  if (separator <= 0 || !category.slice(separator + 1).trim()) {
    return { group, category: '' };
  }
  const prefix = category.slice(0, separator) as QuestionGroup;
  if (!questionGroups.has(prefix) || (group && group !== prefix)) {
    return { group, category: '' };
  }
  return { group: prefix, category };
}
