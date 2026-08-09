import { afterEach, describe, expect, it, vi } from 'vitest';
import { bootstrap } from '../../src/app';

describe('bootstrap', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('assembles the browser data and renders the first question batch', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    class FakeIntersectionObserver {
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    document.body.innerHTML = `
      <input id="search-input">
      <select id="scope-filter"></select>
      <select id="difficulty-filter"></select>
      <button id="clear-filters" hidden></button>
      <nav id="category-nav"></nav>
      <button id="menu-button"></button>
      <aside id="category-drawer"></aside>
      <button id="close-menu"></button>
      <div id="scrim" hidden></div>
      <span id="result-count"></span>
      <section id="question-list"></section>
      <p id="empty-state" hidden></p>
      <div id="load-sentinel"></div>
    `;
    const controller = bootstrap(document, {
      CPP_INTERVIEW_QUESTIONS: [{
        id: '001',
        group: 'cpp',
        category: 'cpp/core-language',
        title: '题目？',
        difficulty: 1,
        scopes: ['C++17'],
        answer: '回答。',
        source: '来源'
      }]
    }, { hash: '#filters' }, { replaceState: () => undefined });

    expect(controller).toBeDefined();
    expect(observe).toHaveBeenCalledOnce();
    const restore = vi.spyOn(controller, 'restoreFromHash');
    controller.dispose();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(disconnect).toHaveBeenCalledOnce();
    expect(restore).not.toHaveBeenCalled();
    expect(document.querySelector('#question-list article h2')?.textContent).toBe('题目？');
    expect(document.querySelector('#result-count')?.textContent).toBe('1 道题');
  });

  it('renders every question when IntersectionObserver is unavailable', () => {
    document.body.innerHTML = `
      <input id="search-input">
      <select id="scope-filter"></select>
      <select id="difficulty-filter"></select>
      <button id="clear-filters" hidden></button>
      <nav id="category-nav"></nav>
      <button id="menu-button"></button>
      <aside id="category-drawer"></aside>
      <button id="close-menu"></button>
      <div id="scrim" hidden></div>
      <span id="result-count"></span>
      <section id="question-list"></section>
      <p id="empty-state" hidden></p>
      <div id="load-sentinel"></div>
    `;
    const rows = Array.from({ length: 35 }, (_, index) => ({
      id: String(index + 1).padStart(3, '0'),
      group: 'cpp',
      category: 'cpp/core-language',
      title: `Question ${index + 1}`,
      difficulty: 1,
      scopes: ['C++17'],
      answer: 'Answer',
      source: 'Source'
    }));

    const controller = bootstrap(
      document,
      { CPP_INTERVIEW_QUESTIONS: rows },
      { hash: '#filters' },
      { replaceState: () => undefined }
    );

    expect(document.querySelectorAll('#question-list article')).toHaveLength(35);
    controller.dispose();
  });
});
