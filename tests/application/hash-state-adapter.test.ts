import { describe, expect, it } from 'vitest';
import { FilterState } from '../../src/domain/filter-state';
import { HashStateAdapter } from '../../src/application/hash-state-adapter';

describe('HashStateAdapter', () => {
  it('round-trips filter values with URLSearchParams encoding', () => {
    const adapter = new HashStateAdapter();
    const state = new FilterState({
      query: 'RAII & move',
      scope: 'C++17',
      difficulty: 4,
      group: 'cpp',
      category: 'cpp/lifetime-raii'
    });

    const hash = adapter.serialize(state);

    expect(hash).toBe('#filters?group=cpp&category=cpp%2Flifetime-raii&scope=C%2B%2B17&difficulty=4&q=RAII+%26+move');
    expect(adapter.parse(hash)).toEqual(state);
  });

  it('falls back to no difficulty when the hash value is invalid', () => {
    const state = new HashStateAdapter().parse('#filters?difficulty=hard&group=cpp');

    expect(state.difficulty).toBeNull();
    expect(state.group).toBe('cpp');
  });

  it('normalizes invalid or conflicting group and category values', () => {
    const adapter = new HashStateAdapter();

    expect(adapter.parse('#filters?group=invalid&category=ue5%2Freflection'))
      .toMatchObject({ group: 'ue5', category: 'ue5/reflection' });
    expect(adapter.parse('#filters?group=cpp&category=ue5%2Freflection'))
      .toMatchObject({ group: 'cpp', category: '' });
    expect(adapter.parse('#filters?category=cpp'))
      .toMatchObject({ group: '', category: '' });
  });
});
