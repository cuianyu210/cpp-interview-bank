import { describe, expect, it } from 'vitest';
import { FilterState } from '../../src/domain/filter-state';
import { QuestionStateStore } from '../../src/application/question-state-store';

describe('QuestionStateStore', () => {
  it('notifies only on value changes and supports unsubscribe', () => {
    const store = new QuestionStateStore(new FilterState());
    const received: string[] = [];
    const listener = (state: FilterState) => received.push(state.query);
    const stop = store.subscribe(listener);

    store.setState(new FilterState());
    store.setState(new FilterState({ query: 'raii' }));
    stop();
    store.setState(new FilterState({ query: 'move' }));

    expect(received).toEqual(['raii']);
    expect(store.getState().query).toBe('move');
  });

  it('continues notifying when one listener throws', () => {
    const store = new QuestionStateStore();
    const received: string[] = [];
    store.subscribe(() => { throw new Error('observer failed'); });
    store.subscribe((state) => received.push(state.query));

    expect(() => store.update({ query: 'raii' })).not.toThrow();
    expect(received).toEqual(['raii']);
  });
});
