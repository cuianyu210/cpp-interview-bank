import { describe, expect, it } from 'vitest';
import { createAuthoringQuestion } from '../../src/domain/question';
import { prepareChangeBatch } from '../../tools/questions/change-batch';

describe('question change batch id allocation', () => {
  it('allocates after an explicit high id added earlier in the same batch', () => {
    const batch = prepareChangeBatch(currentWith('001'), {
      changes: [add('999'), add()]
    });

    expect(batch.questions.map(({ id }) => id)).toEqual(['001', '999', '1000']);
  });

  it('increments consecutive automatic ids', () => {
    const batch = prepareChangeBatch(currentWith('009'), {
      changes: [add(), add(), add()]
    });

    expect(batch.questions.map(({ id }) => id)).toEqual(['009', '010', '011', '012']);
  });

  it('increments an arbitrarily large decimal id without scientific notation', () => {
    const maximum = '999999999999999999999999999999999999';
    const batch = prepareChangeBatch(currentWith(maximum), { changes: [add()] });

    expect(batch.questions.map(({ id }) => id)).toEqual([
      maximum,
      '1000000000000000000000000000000000000'
    ]);
  });

  it('preserves existing relative order when deleting a middle id', () => {
    const batch = prepareChangeBatch(currentWith('001', '002', '003'), {
      changes: [{ action: 'delete', id: '002' }]
    });

    expect(batch.questions.map(({ id }) => id)).toEqual(['001', '003']);
  });
});

function currentWith(...ids: string[]) {
  return {
    questions: ids.map((id) => createAuthoringQuestion(question(id))),
    evidence: []
  };
}

function add(id?: string): Record<string, unknown> {
  return { action: 'add', question: question(id) };
}

function question(id?: string): Record<string, unknown> {
  return {
    ...(id ? { id } : {}),
    group: 'cpp',
    category: 'cpp/lifetime-raii',
    title: `Question ${id ?? 'automatic'}`,
    difficulty: 1,
    scopes: ['C++11'],
    answer: 'First point. Second point.',
    answerSources: [{ authority: 'cppreference', topic: 'RAII' }],
    evidenceIds: ['e-1', 'e-2']
  };
}
