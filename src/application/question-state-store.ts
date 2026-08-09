import { FilterState, type FilterStatePatch } from '../domain/filter-state';

export type QuestionStateListener = (state: FilterState) => void;

export class QuestionStateStore {
  private state: FilterState;
  private readonly listeners = new Set<QuestionStateListener>();

  constructor(initialState: FilterState = new FilterState()) {
    this.state = initialState;
  }

  getState(): FilterState {
    return this.state;
  }

  setState(nextState: FilterState): void {
    if (sameState(this.state, nextState)) return;
    this.state = nextState;
    for (const listener of [...this.listeners]) {
      try {
        listener(nextState);
      } catch {
        // One observer must not prevent the remaining observers from running.
      }
    }
  }

  update(patch: FilterStatePatch): void {
    this.setState(this.state.with(patch));
  }

  subscribe(listener: QuestionStateListener): () => void {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener: QuestionStateListener): void {
    this.listeners.delete(listener);
  }
}

function sameState(left: FilterState, right: FilterState): boolean {
  return left.query === right.query
    && left.scope === right.scope
    && left.difficulty === right.difficulty
    && left.group === right.group
    && left.category === right.category;
}
