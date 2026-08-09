import { describe, expect, it } from 'vitest';
import { MobileDrawerView } from '../../src/presentation/mobile-drawer-view';

describe('MobileDrawerView', () => {
  it('opens from menu and closes from close button, scrim, or Escape', () => {
    document.body.innerHTML = `
      <button id="menu-button" aria-expanded="false"></button>
      <aside id="category-drawer"><button class="category-button">核心语言</button></aside>
      <button id="close-menu"></button>
      <div id="scrim" hidden></div>
    `;
    const view = new MobileDrawerView(document);
    const stop = view.bind();

    document.querySelector<HTMLButtonElement>('#menu-button')!.click();
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(true);
    expect(document.querySelector('#scrim')?.hasAttribute('hidden')).toBe(false);
    expect(document.querySelector('#menu-button')?.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(false);
    expect(document.querySelector('#scrim')?.hasAttribute('hidden')).toBe(true);

    document.querySelector<HTMLButtonElement>('#menu-button')!.click();
    document.querySelector<HTMLButtonElement>('#close-menu')!.click();
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(false);

    document.querySelector<HTMLButtonElement>('#menu-button')!.click();
    document.querySelector('#scrim')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(false);

    document.querySelector<HTMLButtonElement>('#menu-button')!.click();
    document.querySelector<HTMLButtonElement>('.category-button')!.click();
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(false);
    stop();
    document.querySelector<HTMLButtonElement>('#menu-button')!.click();
    expect(document.querySelector('#category-drawer')?.classList.contains('open')).toBe(false);
  });
});
