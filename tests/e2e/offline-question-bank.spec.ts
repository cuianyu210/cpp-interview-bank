import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const pageUrl = pathToFileURL(resolve('index.html')).href;
const questions = [
  question('003', 'ue5', 'ue5/replication-rpc-serialization', 'Replication condition check', 4, ['UE5']),
  question('002', 'ue5', 'ue5/uobject', 'UObject lifecycle', 1, ['UE5']),
  question('001', 'cpp', 'cpp/lifetime-raii', 'RAII manages ownership', 1, ['C++17']),
  question('004', 'cpp', 'cpp/templates', 'ADL expands candidate functions', 2, ['C++20']),
  question('005', 'gof', 'gof/creation', 'Factory method creation', 3, ['C++17'])
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript((fixture) => {
    Object.defineProperty(globalThis, 'CPP_INTERVIEW_QUESTIONS', {
      configurable: false,
      value: fixture,
      writable: false
    });
  }, questions);
});

test('loads the offline page on desktop and mobile without http requests', async ({ page }, testInfo) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (/^https?:\/\//i.test(request.url())) externalRequests.push(request.url());
  });

  await page.goto(pageUrl);

  await expect(page).toHaveTitle('C++ 与工程面试题库');
  await expect(page.locator('#result-count')).toHaveText('5 道题');
  await expect(page.locator('#question-list article')).toHaveCount(5);
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('#menu-button')).toBeVisible();
  } else {
    await expect(page.locator('#menu-button')).toBeHidden();
  }
  expect(externalRequests).toEqual([]);
});

test('orders questions by study path before difficulty and id', async ({ page }) => {
  await page.goto(pageUrl);

  await expect(page.locator('#question-list h2')).toHaveText([
    'RAII manages ownership',
    'ADL expands candidate functions',
    'UObject lifecycle',
    'Replication condition check',
    'Factory method creation'
  ]);
});

test('searches visible question content', async ({ page }) => {
  await page.goto(pageUrl);

  await page.locator('#search-input').fill('RAII');

  await expect(page.locator('#result-count')).toHaveText('1 道题');
  await expect(page.locator('#question-list h2')).toHaveText(['RAII manages ownership']);
  expect(new URL(page.url()).hash).toContain('q=RAII');
});

test('uses identifier boundaries without breaking ASCII prefix searches', async ({ page }) => {
  await page.goto(pageUrl);

  await page.locator('#search-input').fill('ADL');

  await expect(page.locator('#result-count')).toHaveText('1 道题');
  await expect(page.locator('#question-list h2')).toHaveText(['ADL expands candidate functions']);

  await page.locator('#search-input').fill('Factory');

  await expect(page.locator('#result-count')).toHaveText('1 道题');
  await expect(page.locator('#question-list h2')).toHaveText(['Factory method creation']);
});

test('filters questions by difficulty', async ({ page }) => {
  await page.goto(pageUrl);

  await page.locator('#difficulty-filter').selectOption('4');

  await expect(page.locator('#result-count')).toHaveText('1 道题');
  await expect(page.locator('#question-list h2')).toHaveText(['Replication condition check']);
});

test('filters questions by scope', async ({ page }) => {
  await page.goto(pageUrl);

  await page.locator('#scope-filter').selectOption('C++17');

  await expect(page.locator('#result-count')).toHaveText('1 道题');
  await expect(page.locator('#question-list h2')).toHaveText(['RAII manages ownership']);
});

test('restores search and difficulty from the hash', async ({ page }) => {
  const url = new URL(pageUrl);
  url.hash = 'filters?difficulty=4&q=Replication';

  await page.goto(url.href);

  await expect(page.locator('#search-input')).toHaveValue('Replication');
  await expect(page.locator('#difficulty-filter')).toHaveValue('4');
  await expect(page.locator('#question-list h2')).toHaveText(['Replication condition check']);
});

test('mobile drawer closes after selecting a category', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only navigation behavior');
  await page.goto(pageUrl);

  await page.locator('#menu-button').click();
  await expect(page.locator('#category-drawer')).toHaveClass(/open/);
  await page.locator('[data-category="cpp/lifetime-raii"]').click();

  await expect(page.locator('#category-drawer')).not.toHaveClass(/open/);
  await expect(page.locator('#menu-button')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#question-list h2')).toHaveText(['RAII manages ownership']);
});

function question(
  id: string,
  group: 'cpp' | 'gof' | 'ue5',
  category: string,
  title: string,
  difficulty: number,
  scopes: string[]
): Record<string, unknown> {
  return {
    id,
    group,
    category,
    title,
    difficulty,
    scopes,
    answer: `${title} answer`,
    source: 'Authoritative documentation'
  };
}
