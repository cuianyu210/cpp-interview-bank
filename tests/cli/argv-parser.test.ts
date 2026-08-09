import { describe, expect, it } from 'vitest';
import { parseArgs } from '../../tools/questions/argv-parser';

describe('question CLI argument parser', () => {
  it('parses every public command and its supported options', () => {
    expect(parseArgs(['search', '--query', 'raii', '--group', 'cpp', '--full'])).toEqual({
      name: 'search', query: 'raii', group: 'cpp', category: undefined, full: true
    });
    expect(parseArgs(['evidence', '--id', '001'])).toEqual({ name: 'evidence', id: '001' });
    expect(parseArgs(['stats'])).toEqual({ name: 'stats' });
    expect(parseArgs(['apply', '--file', 'patch.json', '--dry-run'])).toEqual({
      name: 'apply', file: 'patch.json', dryRun: true
    });
    expect(parseArgs(['build'])).toEqual({ name: 'build' });
    expect(parseArgs(['check'])).toEqual({ name: 'check' });
  });

  it('rejects unknown options instead of silently ignoring them', () => {
    expect(() => parseArgs(['search', '--unknown', 'value'])).toThrow(/unknown option/i);
    expect(() => parseArgs(['search', '--group', 'unreal'])).toThrow(/unknown question group/i);
  });

  it('requires values for evidence and apply options', () => {
    expect(() => parseArgs(['evidence'])).toThrow(/--id/);
    expect(() => parseArgs(['apply'])).toThrow(/--file/);
  });
});
