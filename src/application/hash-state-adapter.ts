import { isDifficultyValue, type DifficultyValue } from '../domain/difficulty';
import { FilterState } from '../domain/filter-state';
import type { QuestionGroup } from '../domain/question';

const groups = new Set<QuestionGroup>(['cpp', 'gof', 'ue5', 'windows']);

export class HashStateAdapter {
  serialize(state: FilterState): string {
    const values = new URLSearchParams();
    if (state.group) values.set('group', state.group);
    if (state.category) values.set('category', state.category);
    if (state.scope) values.set('scope', state.scope);
    if (state.difficulty !== null) values.set('difficulty', String(state.difficulty));
    if (state.query) values.set('q', state.query);
    const query = values.toString();
    return `#filters${query ? `?${query}` : ''}`;
  }

  parse(hash: string): FilterState {
    const values = filterValues(hash);
    if (values === null) return new FilterState();
    const category = values.get('category') ?? '';
    return new FilterState({
      query: values.get('q') ?? '',
      scope: values.get('scope') ?? '',
      difficulty: parseDifficulty(values.get('difficulty')),
      group: parseGroup(values.get('group')),
      category
    });
  }
}

function filterValues(hash: string): URLSearchParams | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const questionMark = raw.indexOf('?');
  const anchor = questionMark < 0 ? raw : raw.slice(0, questionMark);
  if (anchor !== 'filters') return null;
  return new URLSearchParams(questionMark < 0 ? '' : raw.slice(questionMark + 1));
}

function parseGroup(value: string | null): QuestionGroup | '' {
  const candidate = value ?? '';
  return groups.has(candidate as QuestionGroup) ? candidate as QuestionGroup : '';
}

function parseDifficulty(value: string | null): DifficultyValue | null {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return isDifficultyValue(parsed) ? parsed : null;
}
