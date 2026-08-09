import { HashStateAdapter } from '../application/hash-state-adapter';
import type { FilterState } from '../domain/filter-state';

export interface LocationLike {
  hash: string;
}

export interface HistoryLike {
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

export class BrowserHashAdapter {
  constructor(
    private readonly location: LocationLike,
    private readonly history: HistoryLike,
    private readonly hashAdapter: HashStateAdapter = new HashStateAdapter()
  ) {}

  read(): FilterState {
    return this.hashAdapter.parse(this.location.hash);
  }

  write(state: FilterState): void {
    const hash = this.hashAdapter.serialize(state);
    try {
      this.history.replaceState(null, '', hash);
    } catch {
      this.location.hash = hash;
    }
  }
}
