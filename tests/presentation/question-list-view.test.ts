import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { QuestionListView } from '../../src/presentation/question-list-view';

const question = (id: string): Question => ({
  id,
  group: 'cpp',
  category: 'cpp/core-language',
  title: `Question ${id}`,
  difficulty: 1,
  scopes: ['C++17'],
  answer: 'Answer.',
  source: 'Source'
});

describe('QuestionListView', () => {
  it('renders an initial batch, appends the next batch once, and exposes empty state', () => {
    document.body.innerHTML = `
      <span id="result-count"></span>
      <section id="question-list"></section>
      <p id="empty-state" hidden></p>
    `;
    const view = new QuestionListView(document, 1);

    view.render([question('001'), question('002')]);
    expect(document.querySelectorAll('#question-list article')).toHaveLength(1);
    expect(document.querySelector('#result-count')?.textContent).toBe('2 道题');
    expect(document.querySelector('#empty-state')?.hasAttribute('hidden')).toBe(true);
    expect(view.renderMore()).toBe(true);
    expect(document.querySelectorAll('#question-list article')).toHaveLength(2);
    expect(view.renderMore()).toBe(false);
    expect(document.querySelectorAll('#question-list article')).toHaveLength(2);

    view.render([]);
    expect(document.querySelectorAll('#question-list article')).toHaveLength(0);
    expect(document.querySelector('#empty-state')?.hasAttribute('hidden')).toBe(false);
  });
});
