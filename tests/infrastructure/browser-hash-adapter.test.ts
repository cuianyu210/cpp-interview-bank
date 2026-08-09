import { describe, expect, it } from 'vitest';
import { FilterState } from '../../src/domain/filter-state';
import { BrowserHashAdapter } from '../../src/infrastructure/browser-hash-adapter';

describe('BrowserHashAdapter', () => {
  it('falls back to location.hash when history replacement fails', () => {
    const location = { hash: '#filters?difficulty=invalid&group=ue5' };
    const history = {
      replaceState: () => { throw new DOMException('file URL blocked', 'SecurityError'); }
    };
    const adapter = new BrowserHashAdapter(location, history);

    expect(adapter.read()).toEqual(new FilterState({ group: 'ue5' }));
    adapter.write(new FilterState({ query: 'RAII & move' }));

    expect(location.hash).toBe('#filters?q=RAII+%26+move');
  });
});
