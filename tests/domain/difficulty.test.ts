import { describe, expect, it } from 'vitest';
import { Difficulty, type DifficultyValue } from '../../src/domain/difficulty';

describe('Difficulty', () => {
  it('accepts values from one through five and renders five slots', () => {
    const levels: DifficultyValue[] = [1, 2, 3, 4, 5];

    expect(levels.map((level) => Difficulty.from(level).stars)).toEqual([
      '★☆☆☆☆',
      '★★☆☆☆',
      '★★★☆☆',
      '★★★★☆',
      '★★★★★'
    ]);
  });

  it('rejects values outside the integer range one through five', () => {
    for (const value of [0, 6, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => Difficulty.from(value)).toThrow(RangeError);
    }
  });

  it('is an immutable value object with stable equality', () => {
    const first = Difficulty.from(3);
    const second = Difficulty.from(3);

    expect(Object.isFrozen(first)).toBe(true);
    expect(first.equals(second)).toBe(true);
    expect(first.toString()).toBe('★★★☆☆');
  });
});
