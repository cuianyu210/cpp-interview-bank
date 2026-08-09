import type { QuestionGroup } from '../domain/question';

export type CategoryNavType = 'all' | 'group' | 'category';

export interface CategoryNavItem {
  readonly type: CategoryNavType;
  readonly id: string;
  readonly group: QuestionGroup | '';
  readonly label: string;
  readonly count: number;
}

export type CategorySelectionListener = (item: CategoryNavItem) => void;

export class CategoryNavigationView {
  private readonly nav: HTMLElement;
  private items: readonly CategoryNavItem[] = [];

  constructor(document: Document) {
    const nav = document.getElementById('category-nav');
    if (!nav) throw new Error('Missing category navigation: #category-nav');
    this.nav = nav;
  }

  render(items: readonly CategoryNavItem[]): void {
    this.items = [...items];
    this.nav.textContent = '';
    items.forEach((item, index) => {
      const button = this.nav.ownerDocument.createElement('button');
      const label = this.nav.ownerDocument.createElement('span');
      const count = this.nav.ownerDocument.createElement('span');
      button.type = 'button';
      button.className = `category-button category-${item.type}`;
      button.dataset.index = String(index);
      button.dataset.category = item.type === 'category' ? item.id : '';
      button.dataset.group = item.group;
      button.setAttribute('aria-pressed', 'false');
      label.textContent = item.label;
      count.className = 'count';
      count.textContent = String(item.count);
      button.append(label, count);
      this.nav.append(button);
    });
  }

  bind(listener: CategorySelectionListener): () => void {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('button');
      if (!button || !this.nav.contains(button)) return;
      const index = Number(button.dataset.index);
      const item = this.items[index];
      if (item) listener(item);
    };
    this.nav.onclick = onClick;
    return () => {
      if (this.nav.onclick === onClick) this.nav.onclick = null;
    };
  }

  setActive(id: string): void {
    this.nav.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      const item = this.items[Number(button.dataset.index)];
      const active = item?.id === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
}
