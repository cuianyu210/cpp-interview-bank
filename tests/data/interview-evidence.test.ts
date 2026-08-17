import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Group = 'cpp' | 'gof' | 'ue5' | 'windows';

type InterviewEvidence = {
  id: string;
  company: string;
  role: string;
  sourceTitle: string;
  url: string;
  accessedAt: string;
  reportedQuestion: string;
  publishedAt?: string;
};

const root = resolve(import.meta.dirname, '../../');
const evidence = JSON.parse(
  readFileSync(resolve(root, 'data/evidence/interviews.json'), 'utf8')
) as InterviewEvidence[];

function groupOf(record: InterviewEvidence): Group {
  const match = /^evidence-(cpp|gof|ue5|windows)-\d{3}$/.exec(record.id);
  expect(match, `invalid evidence id: ${record.id}`).not.toBeNull();
  return match?.[1] as Group;
}

describe('interview evidence quality', () => {
  it('uses unique public interview detail URLs instead of search result pages', () => {
    const urls = evidence.map((record) => record.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const record of evidence) {
      const url = new URL(record.url);
      expect(url.protocol, record.id).toBe('https:');
      expect(url.pathname, record.id).not.toMatch(/(?:^|\/)search(?:\/|$)/i);
      expect(url.pathname, record.id).toMatch(/(?:\/discuss\/(?:post\/)?[A-Za-z0-9]+|\/feed\/main\/detail\/[A-Za-z0-9-]+|\/article\/\d+|\/interview\/[^/]+|\/questions?\/\d+)/i);
    }
  });

  it('stores real page titles and quoted question clusters rather than placeholders', () => {
    const placeholder = /公开\s*(?:cpp|gof|ue5|windows)\s*面经检索记录|该岗位公开面试记录涉及|涉及.{0,20}的生命周期、边界和故障排查问题/iu;

    for (const record of evidence) {
      expect(record.sourceTitle, record.id).not.toMatch(placeholder);
      expect(record.reportedQuestion, record.id).not.toMatch(placeholder);
      expect(record.sourceTitle.trim().length, record.id).toBeGreaterThanOrEqual(4);
      expect(record.reportedQuestion.trim().length, record.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('keeps at least four distinct interview pages for every question group', () => {
    for (const group of ['cpp', 'gof', 'ue5'] satisfies Group[]) {
      const urls = evidence.filter((record) => groupOf(record) === group).map((record) => record.url);
      expect(new Set(urls).size, group).toBeGreaterThanOrEqual(4);
    }
  });
});
