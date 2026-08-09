export type DifficultyValue = 1 | 2 | 3 | 4 | 5;

export function isDifficultyValue(value: unknown): value is DifficultyValue {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= 1
    && value <= 5;
}

export class Difficulty {
  readonly value: DifficultyValue;

  private constructor(value: DifficultyValue) {
    this.value = value;
    Object.freeze(this);
  }

  static from(value: unknown): Difficulty {
    if (!isDifficultyValue(value)) {
      throw new RangeError('Difficulty must be an integer from 1 to 5');
    }
    return new Difficulty(value);
  }

  get stars(): string {
    return '★'.repeat(this.value) + '☆'.repeat(5 - this.value);
  }

  equals(other: Difficulty): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.stars;
  }
}
