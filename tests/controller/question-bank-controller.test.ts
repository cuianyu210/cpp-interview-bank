import { describe, expect, it, vi } from 'vitest';
import { FilterState, type FilterStatePatch } from '../../src/domain/filter-state';
import type { Question } from '../../src/domain/question';
import type { CategoryNavItem } from '../../src/presentation/category-navigation-view';
import { InMemoryQuestionRepository } from '../../src/infrastructure/in-memory-question-repository';
import { QuestionQueryService } from '../../src/application/question-query-service';
import { QuestionStateStore } from '../../src/application/question-state-store';
import { QuestionBankController } from '../../src/controller/question-bank-controller';

const question: Question = {
  id: '001',
  group: 'cpp',
  category: 'cpp/core-language',
  title: 'Question title',
  difficulty: 1,
  scopes: ['C++17'],
  answer: 'Answer.',
  source: 'Source'
};

describe('QuestionBankController', () => {
  it('coordinates initial hash state, query rendering, and control patches', () => {
    const repository = new InMemoryQuestionRepository([question]);
    const service = new QuestionQueryService(repository);
    const query = vi.spyOn(service, 'query');
    const store = new QuestionStateStore();
    const hash = {
      read: vi.fn(() => store.getState()),
      write: vi.fn()
    };
    let controlListener: ((patch: FilterStatePatch) => void) | undefined;
    const controls = {
      setScopes: vi.fn(),
      setState: vi.fn(),
      bind: vi.fn((listener: (patch: FilterStatePatch) => void) => {
        controlListener = listener;
        return () => undefined;
      })
    };
    const navigation = {
      render: vi.fn(), bind: vi.fn(() => () => undefined), setActive: vi.fn()
    };
    const list = { render: vi.fn(), renderMore: vi.fn(() => false) };

    const controller = new QuestionBankController(
      repository,
      service,
      store,
      hash,
      { controls, navigation, list }
    );
    controller.start();
    controlListener?.({ query: 'raii' });

    expect(hash.read).toHaveBeenCalledOnce();
    expect(query).toHaveBeenCalled();
    expect(list.render).toHaveBeenCalledWith([question]);
    expect(hash.write).toHaveBeenCalled();
    expect(controls.setScopes).toHaveBeenCalledWith(['C++17']);
  });

  it('starts once and stops reacting to state after disposal', () => {
    const repository = new InMemoryQuestionRepository([question]);
    const service = new QuestionQueryService(repository);
    const store = new QuestionStateStore();
    const hash = { read: vi.fn(() => new FilterState()), write: vi.fn() };
    const stopControls = vi.fn();
    const stopNavigation = vi.fn();
    const controls = {
      setScopes: vi.fn(), setState: vi.fn(), bind: vi.fn(() => stopControls)
    };
    const navigation = {
      render: vi.fn(), bind: vi.fn(() => stopNavigation), setActive: vi.fn()
    };
    const list = { render: vi.fn(), renderMore: vi.fn(() => false) };
    const controller = new QuestionBankController(
      repository, service, store, hash, { controls, navigation, list }
    );

    controller.start();
    controller.start();
    store.update({ query: 'first' });

    expect(controls.bind).toHaveBeenCalledOnce();
    expect(navigation.bind).toHaveBeenCalledOnce();
    expect(hash.write).toHaveBeenCalledOnce();

    controller.dispose();
    store.update({ query: 'after-dispose' });
    controller.restoreFromHash();

    expect(hash.write).toHaveBeenCalledOnce();
    expect(hash.read).toHaveBeenCalledOnce();
    expect(stopControls).toHaveBeenCalledOnce();
    expect(stopNavigation).toHaveBeenCalledOnce();
  });

  it('selects categories and restores hash state without writing it back', () => {
    const repository = new InMemoryQuestionRepository([question]);
    const service = new QuestionQueryService(repository);
    const store = new QuestionStateStore();
    const restored = new FilterState({ group: 'ue5' });
    const hash = {
      read: vi.fn()
        .mockReturnValueOnce(new FilterState())
        .mockReturnValueOnce(restored),
      write: vi.fn()
    };
    let select: ((item: CategoryNavItem) => void) | undefined;
    const controls = {
      setScopes: vi.fn(), setState: vi.fn(), bind: vi.fn(() => () => undefined)
    };
    const navigation = {
      render: vi.fn(),
      bind: vi.fn((listener: (item: CategoryNavItem) => void) => {
        select = listener;
        return () => undefined;
      }),
      setActive: vi.fn()
    };
    const list = { render: vi.fn(), renderMore: vi.fn(() => false) };
    const controller = new QuestionBankController(
      repository, service, store, hash, { controls, navigation, list }
    );
    controller.start();
    hash.write.mockClear();

    select?.({
      type: 'category', id: 'cpp/core-language', group: 'cpp', label: 'Core', count: 1
    });

    expect(store.getState()).toMatchObject({ group: 'cpp', category: 'cpp/core-language' });
    expect(hash.write).toHaveBeenCalledOnce();
    hash.write.mockClear();

    controller.restoreFromHash();

    expect(store.getState()).toEqual(restored);
    expect(hash.write).not.toHaveBeenCalled();
    expect(list.render).toHaveBeenLastCalledWith([]);
  });

  it('renders readable labels for category slugs', () => {
    const questions: Question[] = [
      question,
      {
        ...question,
        id: '002',
        group: 'ue5',
        category: 'ue5/uobject-reflection-gc',
        scopes: ['UE5']
      },
      {
        ...question,
        id: '003',
        group: 'ue5',
        category: 'ue5/delegate-interface-async',
        scopes: ['UE5']
      },
      {
        ...question,
        id: '004',
        group: 'cpp',
        category: 'cpp/stl',
        title: 'vector reallocation invalidation',
        scopes: ['C++17']
      }
    ];
    const repository = new InMemoryQuestionRepository(questions);
    const navigation = {
      render: vi.fn(), bind: vi.fn(() => () => undefined), setActive: vi.fn()
    };
    const controller = new QuestionBankController(
      repository,
      new QuestionQueryService(repository),
      new QuestionStateStore(),
      { read: () => new FilterState(), write: vi.fn() },
      {
        controls: {
          setScopes: vi.fn(), setState: vi.fn(), bind: vi.fn(() => () => undefined)
        },
        navigation,
        list: { render: vi.fn(), renderMore: vi.fn(() => false) }
      }
    );

    controller.start();
    const items = navigation.render.mock.calls[0][0] as CategoryNavItem[];
    const labels = Object.fromEntries(items.map((item) => [item.id, item.label]));

    expect(labels).toMatchObject({
      'cpp/core-language': '核心语言',
      'cpp/stl': 'STL/标准库',
      'ue5/uobject-reflection-gc': 'UObject、反射与垃圾回收',
      'ue5/delegate-interface-async': '委托、接口与异步'
    });
  });

  it('orders category navigation by the study path instead of alphabetically', () => {
    const questions: Question[] = [
      {
        ...question,
        id: '001',
        group: 'ue5',
        category: 'ue5/actor-component-subsystem',
        title: 'Actor basics',
        scopes: ['UE5']
      },
      {
        ...question,
        id: '002',
        category: 'cpp/stl',
        title: 'STL containers',
        scopes: ['C++17']
      },
      {
        ...question,
        id: '003',
        category: 'cpp/classes-object-model',
        title: 'Classes and objects',
        scopes: ['C++17']
      },
      {
        ...question,
        id: '004',
        category: 'cpp/core-language',
        title: 'What is C++?',
        scopes: ['C++17']
      },
      {
        ...question,
        id: '005',
        group: 'gof',
        category: 'gof/behavioral',
        title: 'Behavioral patterns',
        scopes: ['GoF']
      },
      {
        ...question,
        id: '006',
        group: 'gof',
        category: 'gof/creation',
        title: 'Creation patterns',
        scopes: ['GoF']
      }
    ];
    const repository = new InMemoryQuestionRepository(questions);
    const navigation = {
      render: vi.fn(), bind: vi.fn(() => () => undefined), setActive: vi.fn()
    };
    const controller = new QuestionBankController(
      repository,
      new QuestionQueryService(repository),
      new QuestionStateStore(),
      { read: () => new FilterState(), write: vi.fn() },
      {
        controls: {
          setScopes: vi.fn(), setState: vi.fn(), bind: vi.fn(() => () => undefined)
        },
        navigation,
        list: { render: vi.fn(), renderMore: vi.fn(() => false) }
      }
    );

    controller.start();
    const items = navigation.render.mock.calls[0][0] as CategoryNavItem[];
    const categoryIds = items.filter((item) => item.type === 'category').map((item) => item.id);

    expect(categoryIds).toEqual([
      'cpp/core-language',
      'cpp/classes-object-model',
      'cpp/stl',
      'gof/creation',
      'gof/behavioral',
      'ue5/actor-component-subsystem'
    ]);
  });
});

