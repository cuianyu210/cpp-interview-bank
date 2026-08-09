import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../../');
const assets = ['styles.css', 'questions.js', 'app.js'] as const;

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function assetHash(relativePath: string): string {
  return createHash('sha256').update(read(relativePath)).digest('hex').slice(0, 8);
}

describe('index asset references', () => {
  it('uses content-hashed query strings to avoid stale GitHub Pages assets', () => {
    const html = read('index.html');

    for (const asset of assets) {
      expect(html).toContain(`${asset}?v=${assetHash(asset)}`);
      expect(html).not.toMatch(new RegExp(`["']${asset}["']`));
    }
  });
});
