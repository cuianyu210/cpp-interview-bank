import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const htmlPath = 'index.html';
const assets = ['styles.css', 'questions.js', 'app.js'] as const;

function hashAsset(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 8);
}

function versionedAsset(path: string): string {
  return `${path}?v=${hashAsset(path)}`;
}

function replaceAssetReference(html: string, path: string): string {
  const escapedPath = path.replace('.', String.raw`\.`);
  const pattern = new RegExp(`${escapedPath}(?:\\?v=[a-f0-9]{8})?`, 'g');
  return html.replace(pattern, versionedAsset(path));
}

function versionHtmlAssets(html: string): string {
  return assets.reduce((nextHtml, asset) => replaceAssetReference(nextHtml, asset), html);
}

writeFileSync(htmlPath, versionHtmlAssets(readFileSync(htmlPath, 'utf8')), 'utf8');
