import type { InterviewEvidence } from '../../src/domain/question';

const searchParameters = new Set(['keyword', 'keywords', 'query', 'search', 'q']);
const detailTrackingParameters = new Set(['from', 'ref']);
const contentIdentityParameters = new Set([
  'id',
  'articleid',
  'postid',
  'questionid',
  'interviewid',
  'detailid'
]);
const genericChinese = /^(?:常见|高频|热门)?\s*(?:c\+\+|cpp|gof|ue5|windows)?\s*(?:面试)?\s*(?:题目?|问题)\s*(?:整理|合集|汇总|大全|列表)?$/iu;
const genericEnglish = /^(?:(?:common|frequent|high[- ]frequency)\s+)?(?:c\+\+|cpp|gof|ue5|windows)?\s*(?:interview\s*)?(?:questions?|problems?)(?:\s*(?:collection|list|summary))?$/iu;
const genericSearchRecord = /^公开\s*(?:c\+\+|cpp|gof|ue5|windows)\s*面经检索记录$/iu;
const genericReportedQuestion = /^该岗位公开面试记录涉及\s*(?:c\+\+|cpp|gof|ue5|windows)\s*的生命周期、边界和故障排查问题$/iu;

export function validateInterviewEvidence(
  evidence: InterviewEvidence,
  seenUrls: Set<string>
): readonly string[] {
  const errors: string[] = [];
  const normalizedUrl = normalizeEvidenceUrl(evidence.url);
  if (isSearchOrListingPage(evidence.url)) {
    errors.push(`evidence ${evidence.id}: search or listing page URLs are not allowed`);
  }
  if (seenUrls.has(normalizedUrl)) {
    errors.push(`evidence ${evidence.id}: duplicate URL ${evidence.url}`);
  }
  seenUrls.add(normalizedUrl);
  if (isGenericPlaceholder(evidence.sourceTitle)) {
    errors.push(`evidence ${evidence.id}: generic source title is not allowed`);
  }
  if (isGenericPlaceholder(evidence.reportedQuestion)) {
    errors.push(`evidence ${evidence.id}: generic reported question is not allowed`);
  }
  return errors;
}

export function normalizeEvidenceUrl(value: string): string {
  const url = new URL(value);
  url.hash = '';
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/u, '');
  removeTrackingParameters(url);
  url.searchParams.sort();
  return url.href;
}

function isSearchOrListingPage(value: string): boolean {
  const url = new URL(value);
  const pathIsSearch = /(?:^|\/)(?:search|search-results?|list|listing)(?:\/|$)/iu.test(url.pathname);
  const pathIsCollection = /(?:^|\/)(?:interviews?|questions?|articles?|discuss)(?:\/)?$/iu
    .test(url.pathname);
  if (pathIsSearch || hasSearchParameters(url)) return true;
  return pathIsCollection && !hasContentIdentity(url);
}

function removeTrackingParameters(url: URL): void {
  const pathIdentifiesDetail = isKnownDetailPath(url.pathname) || hasContentIdentity(url);
  for (const key of [...url.searchParams.keys()]) {
    const normalizedKey = key.toLocaleLowerCase();
    if (normalizedKey.startsWith('utm_')
      || (pathIdentifiesDetail && detailTrackingParameters.has(normalizedKey))) {
      url.searchParams.delete(key);
    }
  }
}

function hasSearchParameters(url: URL): boolean {
  return [...url.searchParams.keys()].some((key) => searchParameters.has(key.toLowerCase()));
}

function hasContentIdentity(url: URL): boolean {
  return [...url.searchParams.entries()].some(([key, value]) => (
    contentIdentityParameters.has(key.toLocaleLowerCase()) && value.trim().length > 0
  ));
}

function isKnownDetailPath(pathname: string): boolean {
  return /\/(?:discuss\/(?:post\/)?[\w-]+|feed\/main\/detail\/[\w-]+|article\/\d+|interview\/[^/]+|questions?\/\d+)(?:\/|$)/iu.test(pathname);
}

function isGenericPlaceholder(value: string): boolean {
  const normalized = value.normalize('NFKC')
    .trim()
    .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, '')
    .trim();
  return genericChinese.test(normalized)
    || genericEnglish.test(normalized)
    || genericSearchRecord.test(normalized)
    || genericReportedQuestion.test(normalized);
}
