import { afterEach, describe, expect, it, vi } from 'vitest';

describe('browser entry', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'readyState');
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('starts the application once the DOM is ready', async () => {
    installPage();
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'loading' });
    vi.stubGlobal('CPP_INTERVIEW_QUESTIONS', [question('001')]);

    const entry = await import('../../src/main');

    expect(document.querySelectorAll('#question-list article')).toHaveLength(0);
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(document.querySelectorAll('#question-list article')).toHaveLength(1);
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(document.querySelectorAll('#question-list article')).toHaveLength(1);
    entry.stopApplication();
  });
});

function installPage(): void {
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
}

function question(id: string): Record<string, unknown> {
  return {
    id,
    group: 'cpp',
    category: 'cpp/core-language',
    title: `Question ${id}`,
    difficulty: 1,
    scopes: ['C++17'],
    answer: 'Answer',
    source: 'Source'
  };
}
