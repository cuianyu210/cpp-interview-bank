import { describe, expect, it } from 'vitest';
import { FilterState } from '../../src/domain/filter-state';

describe('FilterState', () => {
  it('starts with empty filters and no selected difficulty', () => {
    expect(new FilterState()).toEqual({
      query: '',
      scope: '',
      difficulty: null,
      group: '',
      category: ''
    });
  });

  it('returns a new frozen state while preserving the original', () => {
    const original = new FilterState({
      query: 'raii',
      scope: 'C++17',
      difficulty: 3,
      group: 'cpp',
      category: 'cpp/lifetime-raii'
    });

    const updated = original.with({ query: 'move', difficulty: 4 });

    expect(updated).toEqual({
      query: 'move',
      scope: 'C++17',
      difficulty: 4,
      group: 'cpp',
      category: 'cpp/lifetime-raii'
    });
    expect(original.query).toBe('raii');
    expect(original.difficulty).toBe(3);
    expect(updated).not.toBe(original);
    expect(Object.isFrozen(original)).toBe(true);
    expect(Object.isFrozen(updated)).toBe(true);
  });

  it('rejects an invalid difficulty patch', () => {
    const state = new FilterState();

    expect(() => state.with({ difficulty: 0 as never })).toThrow(RangeError);
  });

  it('rejects non-integer difficulty boundaries', () => {
    expect(() => new FilterState({ difficulty: 1.5 as never })).toThrow(RangeError);
    expect(() => new FilterState({ difficulty: 6 as never })).toThrow(RangeError);
  });

  it('allows clearing a selected difficulty without mutating the source state', () => {
    const selected = new FilterState({ difficulty: 5 });
    const cleared = selected.with({ difficulty: null });

    expect(selected.difficulty).toBe(5);
    expect(cleared.difficulty).toBeNull();
    expect(cleared).not.toBe(selected);
  });

  it('keeps category and group as one consistent selection', () => {
    const inferred = new FilterState({ category: 'ue5/reflection' });
    const changedCategory = new FilterState({ group: 'cpp' })
      .with({ category: 'ue5/reflection' });
    const changedGroup = inferred.with({ group: 'cpp' });

    expect(inferred).toMatchObject({ group: 'ue5', category: 'ue5/reflection' });
    expect(changedCategory).toMatchObject({ group: 'ue5', category: 'ue5/reflection' });
    expect(changedGroup).toMatchObject({ group: 'cpp', category: '' });
  });
});
