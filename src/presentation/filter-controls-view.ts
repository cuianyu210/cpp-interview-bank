import { isDifficultyValue } from '../domain/difficulty';
import type { FilterState, FilterStatePatch } from '../domain/filter-state';

export type FilterPatchListener = (patch: FilterStatePatch) => void;

export class FilterControlsView {
  private readonly search: HTMLInputElement;
  private readonly scope: HTMLSelectElement;
  private readonly difficulty: HTMLSelectElement;
  private readonly clear: HTMLButtonElement;

  constructor(document: Document) {
    this.search = required<HTMLInputElement>(document, 'search-input');
    this.scope = required<HTMLSelectElement>(document, 'scope-filter');
    this.difficulty = required<HTMLSelectElement>(document, 'difficulty-filter');
    this.clear = required<HTMLButtonElement>(document, 'clear-filters');
    this.populateDifficulty();
  }

  setScopes(scopes: readonly string[]): void {
    this.scope.textContent = '';
    this.scope.append(option(this.scope.ownerDocument, '', '全部范围'));
    [...new Set(scopes)].sort().forEach((value) => {
      this.scope.append(option(this.scope.ownerDocument, value, value));
    });
  }

  setState(state: FilterState): void {
    this.search.value = state.query;
    this.scope.value = state.scope;
    this.difficulty.value = state.difficulty === null ? '' : String(state.difficulty);
    this.clear.hidden = !hasFilters(state);
  }

  bind(listener: FilterPatchListener): () => void {
    const onSearch = () => listener({ query: this.search.value });
    const onScope = () => listener({ scope: this.scope.value });
    const onDifficulty = () => listener({ difficulty: readDifficulty(this.difficulty.value) });
    const onClear = () => listener({
      query: '', scope: '', difficulty: null, group: '', category: ''
    });
    this.search.oninput = onSearch;
    this.scope.onchange = onScope;
    this.difficulty.onchange = onDifficulty;
    this.clear.onclick = onClear;
    return () => {
      if (this.search.oninput === onSearch) this.search.oninput = null;
      if (this.scope.onchange === onScope) this.scope.onchange = null;
      if (this.difficulty.onchange === onDifficulty) this.difficulty.onchange = null;
      if (this.clear.onclick === onClear) this.clear.onclick = null;
    };
  }

  private populateDifficulty(): void {
    this.difficulty.textContent = '';
    this.difficulty.append(option(this.difficulty.ownerDocument, '', '全部难度'));
    for (let value = 1; value <= 5; value += 1) {
      this.difficulty.append(option(this.difficulty.ownerDocument, String(value), `${value} ${'★'.repeat(value)}`));
    }
  }
}

function readDifficulty(value: string): 1 | 2 | 3 | 4 | 5 | null {
  const parsed = Number(value);
  return isDifficultyValue(parsed) ? parsed : null;
}

function hasFilters(state: FilterState): boolean {
  return Boolean(state.query || state.scope || state.difficulty || state.group || state.category);
}

function option(document: Document, value: string, label: string): HTMLOptionElement {
  const element = document.createElement('option');
  element.value = value;
  element.textContent = label;
  return element;
}

function required<T extends HTMLElement>(document: Document, id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing filter element: #${id}`);
  return element as T;
}
