import { describe, expect, it } from 'vitest';
import { FilterState } from '../../src/domain/filter-state';
import { FilterControlsView } from '../../src/presentation/filter-controls-view';

describe('FilterControlsView', () => {
  it('populates options and emits patches from user controls', () => {
    document.body.innerHTML = `
      <input id="search-input">
      <select id="scope-filter"></select>
      <select id="difficulty-filter"></select>
      <button id="clear-filters" hidden>清除</button>
    `;
    const view = new FilterControlsView(document);
    const patches: unknown[] = [];
    view.setScopes(['C++17', 'UE5']);
    const stop = view.bind((patch) => patches.push(patch));

    expect(document.querySelectorAll('#difficulty-filter option')).toHaveLength(6);
    expect(document.querySelectorAll('#scope-filter option')).toHaveLength(3);

    const search = document.querySelector<HTMLInputElement>('#search-input')!;
    search.value = 'raii';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    const difficulty = document.querySelector<HTMLSelectElement>('#difficulty-filter')!;
    difficulty.value = '3';
    difficulty.dispatchEvent(new Event('change', { bubbles: true }));

    expect(patches).toEqual([{ query: 'raii' }, { difficulty: 3 }]);
    view.setState(new FilterState({ query: 'move', difficulty: 4 }));
    expect(search.value).toBe('move');
    expect(difficulty.value).toBe('4');
    stop();
    search.value = 'ignored';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    expect(patches).toHaveLength(2);
  });
});
