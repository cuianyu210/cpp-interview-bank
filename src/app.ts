import { QuestionQueryService } from './application/question-query-service';
import { QuestionStateStore } from './application/question-state-store';
import { BrowserHashAdapter } from './infrastructure/browser-hash-adapter';
import type { HistoryLike, LocationLike } from './infrastructure/browser-hash-adapter';
import { BrowserQuestionDataAdapter, type BrowserQuestionSource } from './infrastructure/browser-question-data-adapter';
import { InMemoryQuestionRepository } from './infrastructure/in-memory-question-repository';
import { CategoryNavigationView } from './presentation/category-navigation-view';
import { FilterControlsView } from './presentation/filter-controls-view';
import { MobileDrawerView } from './presentation/mobile-drawer-view';
import { QuestionListView } from './presentation/question-list-view';
import { QuestionBankController } from './controller/question-bank-controller';

export function bootstrap(
  document: Document,
  source: BrowserQuestionSource = globalThis as unknown as BrowserQuestionSource,
  location: LocationLike = globalThis.location,
  history: HistoryLike = globalThis.history
): QuestionBankController {
  const questions = new BrowserQuestionDataAdapter(source).load();
  const repository = new InMemoryQuestionRepository(questions);
  const service = new QuestionQueryService(repository);
  const store = new QuestionStateStore();
  const hash = new BrowserHashAdapter(location, history);
  const controls = new FilterControlsView(document);
  const navigation = new CategoryNavigationView(document);
  const list = new QuestionListView(document);
  const drawer = new MobileDrawerView(document);
  const controller = new QuestionBankController(repository, service, store, hash, {
    controls,
    navigation,
    list
  });

  controller.start();
  controller.registerCleanup(drawer.bind());
  controller.registerCleanup(bindLoading(document, controller));
  controller.registerCleanup(bindHashChange(document, controller));
  return controller;
}

function bindLoading(document: Document, controller: QuestionBankController): () => void {
  const sentinel = document.getElementById('load-sentinel');
  const Observer = document.defaultView?.IntersectionObserver;
  if (!sentinel) return noop;
  if (!Observer) {
    while (controller.renderMore()) continue;
    return noop;
  }
  const observer = new Observer((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) controller.renderMore();
  }, { rootMargin: '400px' });
  observer.observe(sentinel);
  return () => observer.disconnect();
}

function bindHashChange(document: Document, controller: QuestionBankController): () => void {
  const view = document.defaultView;
  if (!view) return noop;
  const restore = () => controller.restoreFromHash();
  view.addEventListener('hashchange', restore);
  return () => view.removeEventListener('hashchange', restore);
}

const noop = (): void => undefined;
