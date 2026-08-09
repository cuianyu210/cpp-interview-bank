export class MobileDrawerView {
  private readonly menu: HTMLButtonElement;
  private readonly drawer: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly scrim: HTMLElement;

  constructor(document: Document) {
    this.menu = required<HTMLButtonElement>(document, 'menu-button');
    this.drawer = required<HTMLElement>(document, 'category-drawer');
    this.closeButton = required<HTMLButtonElement>(document, 'close-menu');
    this.scrim = required<HTMLElement>(document, 'scrim');
  }

  bind(): () => void {
    const open = () => this.open();
    const close = () => this.close();
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.close();
    };
    const onDrawerClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('.category-button')) this.close();
    };
    this.menu.onclick = open;
    this.closeButton.onclick = close;
    this.scrim.onclick = close;
    this.drawer.addEventListener('click', onDrawerClick);
    this.menu.ownerDocument.addEventListener('keydown', onKeydown);
    return () => {
      if (this.menu.onclick === open) this.menu.onclick = null;
      if (this.closeButton.onclick === close) this.closeButton.onclick = null;
      if (this.scrim.onclick === close) this.scrim.onclick = null;
      this.drawer.removeEventListener('click', onDrawerClick);
      this.menu.ownerDocument.removeEventListener('keydown', onKeydown);
    };
  }

  open(): void {
    this.drawer.classList.add('open');
    this.scrim.hidden = false;
    this.menu.setAttribute('aria-expanded', 'true');
    this.closeButton.focus();
  }

  close(): void {
    this.drawer.classList.remove('open');
    this.scrim.hidden = true;
    this.menu.setAttribute('aria-expanded', 'false');
  }
}

function required<T extends HTMLElement>(document: Document, id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing drawer element: #${id}`);
  return element as T;
}
