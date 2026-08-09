import { describe, expect, it } from 'vitest';
import type { QuestionGroup } from '../../src/domain/question';
import { CategoryNavigationView, type CategoryNavItem } from '../../src/presentation/category-navigation-view';

describe('CategoryNavigationView', () => {
  it('renders grouped buttons and reports category selection', () => {
    document.body.innerHTML = '<nav id="category-nav"></nav>';
    const view = new CategoryNavigationView(document);
    const items: CategoryNavItem[] = [
      { type: 'all', id: '', group: '', label: '全部题目', count: 2 },
      { type: 'group', id: 'cpp', group: 'cpp', label: '标准 C++', count: 2 },
      { type: 'category', id: 'cpp/core-language', group: 'cpp', label: '核心语言', count: 2 }
    ];
    const selected: CategoryNavItem[] = [];
    view.render(items);
    const stop = view.bind((item) => selected.push(item));
    const selectedGroup: QuestionGroup | '' = items[1].group;

    const category = document.querySelector<HTMLButtonElement>('[data-category="cpp/core-language"]')!;
    category.click();
    view.setActive('cpp/core-language');

    expect(document.querySelectorAll('#category-nav button')).toHaveLength(3);
    expect(category.getAttribute('aria-pressed')).toBe('true');
    expect(selected).toEqual([items[2]]);
    expect(selectedGroup).toBe('cpp');
    expect(category.textContent).toContain('核心语言');
    expect(category.textContent).toContain('2');
    stop();
    category.click();
    expect(selected).toEqual([items[2]]);
  });
});
