const asciiTechnicalTerm = /^[a-z0-9_:+.-]+$/i;
const identifierCharacter = /^[a-z0-9_]$/i;

export function matchesSearchText(text: string, rawQuery: string): boolean {
  const query = rawQuery.trim().toLocaleLowerCase();
  if (!query) return true;
  const candidate = text.toLocaleLowerCase();
  if (!asciiTechnicalTerm.test(query)) return candidate.includes(query);

  let index = candidate.indexOf(query);
  while (index >= 0) {
    const before = index > 0 ? candidate[index - 1] : '';
    const afterIndex = index + query.length;
    const after = afterIndex < candidate.length ? candidate[afterIndex] : '';
    if (startsAtIdentifierBoundary(query, before, after)) return true;
    index = candidate.indexOf(query, index + 1);
  }
  return false;
}

function startsAtIdentifierBoundary(query: string, before: string, after: string): boolean {
  const needsLeftBoundary = identifierCharacter.test(query[0]);
  const needsRightBoundary = /^\d+$/u.test(query);
  return (!needsLeftBoundary || !identifierCharacter.test(before))
    && (!needsRightBoundary || !identifierCharacter.test(after));
}
