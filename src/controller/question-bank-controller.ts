import type { FilterState } from '../domain/filter-state';
import type { Question, QuestionGroup } from '../domain/question';
import type { QuestionQueryService } from '../application/question-query-service';
import type { QuestionRepository } from '../application/question-repository';
import { QuestionStateStore } from '../application/question-state-store';
import {
  categoryLabel,
  sortCategoriesByStudyPath,
  studyPathGroupLabels,
  studyPathGroupOrder
} from '../application/question-taxonomy';
import type { CategoryNavItem, CategoryNavigationView } from '../presentation/category-navigation-view';
import type { FilterControlsView } from '../presentation/filter-controls-view';
import type { QuestionListView } from '../presentation/question-list-view';

export interface QuestionBankViews {
  readonly controls: Pick<FilterControlsView, 'setScopes' | 'setState' | 'bind'>;
  readonly navigation: Pick<CategoryNavigationView, 'render' | 'bind' | 'setActive'>;
  readonly list: Pick<QuestionListView, 'render' | 'renderMore'>;
}

export interface HashStatePort {
  read(): FilterState;
  write(state: FilterState): void;
}

export class QuestionBankController {
  private stopState: (() => void) | undefined;
  private stopViews: Array<() => void> = [];
  private ownedCleanups: Array<() => void> = [];
  private started = false;
  private restoringHash = false;
  private disposed = false;

  constructor(
    private readonly repository: QuestionRepository,
    private readonly queryService: Pick<QuestionQueryService, 'query'>,
    private readonly store: QuestionStateStore,
    private readonly hash: HashStatePort,
    private readonly views: QuestionBankViews
  ) {}

  start(): void {
    if (this.disposed) throw new Error('Cannot start a disposed controller');
    if (this.started) return;
    const questions = this.repository.findAll();
    this.views.controls.setScopes(uniqueScopes(questions));
    this.views.navigation.render(buildNavigation(questions));
    this.store.setState(this.readHash());
    this.stopViews = [
      this.views.controls.bind((patch) => this.store.update(patch)),
      this.views.navigation.bind((item) => this.selectCategory(item))
    ];
    this.stopState = this.store.subscribe((state) => {
      this.renderState(state);
      if (!this.restoringHash) this.writeHash(state);
    });
    this.started = true;
    this.renderState(this.store.getState());
  }

  restoreFromHash(): void {
    if (!this.started || this.disposed) return;
    this.restoringHash = true;
    try {
      this.store.setState(this.readHash());
    } finally {
      this.restoringHash = false;
    }
  }

  renderMore(): boolean {
    return this.disposed ? false : this.views.list.renderMore();
  }

  registerCleanup(cleanup: () => void): void {
    if (this.disposed) {
      cleanup();
      return;
    }
    this.ownedCleanups.push(cleanup);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stopState?.();
    this.stopState = undefined;
    disposeAll([
      ...this.stopViews.splice(0),
      ...this.ownedCleanups.splice(0)
    ].reverse());
    this.started = false;
  }

  private renderState(state: FilterState): void {
    this.views.controls.setState(state);
    this.views.navigation.setActive(state.category || state.group);
    this.views.list.render(this.queryService.query(state));
  }

  private selectCategory(item: CategoryNavItem): void {
    if (item.type === 'all') this.store.update({ group: '', category: '' });
    else if (item.type === 'group') this.store.update({ group: item.group, category: '' });
    else this.store.update({ group: item.group as QuestionGroup, category: item.id });
  }

  private readHash(): FilterState {
    return this.hash.read();
  }

  private writeHash(state: FilterState): void {
    this.hash.write(state);
  }
}

function uniqueScopes(questions: readonly Question[]): string[] {
  return [...new Set(questions.flatMap((question) => question.scopes))].sort();
}

function buildNavigation(questions: readonly Question[]): CategoryNavItem[] {
  const items: CategoryNavItem[] = [
    { type: 'all', id: '', group: '', label: '全部题目', count: questions.length }
  ];
  for (const group of studyPathGroupOrder) {
    const groupQuestions = questions.filter((question) => question.group === group);
    items.push({
      type: 'group',
      id: group,
      group,
      label: studyPathGroupLabels[group],
      count: groupQuestions.length
    });
    const categories = sortCategoriesByStudyPath(
      group,
      [...new Set(groupQuestions.map((question) => question.category))]
    );
    categories.forEach((category) => {
      items.push({
        type: 'category',
        id: category,
        group,
        label: categoryLabel(category),
        count: groupQuestions.filter((question) => question.category === category).length
      });
    });
  }
  return items;
}

function disposeAll(cleanups: readonly (() => void)[]): void {
  cleanups.forEach((cleanup) => {
    try {
      cleanup();
    } catch {
      // One failed cleanup must not prevent the remaining resources from being released.
    }
  });
}
