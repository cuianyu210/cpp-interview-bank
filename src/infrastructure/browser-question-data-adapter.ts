import { createQuestion, type Question } from '../domain/question';

export interface BrowserQuestionSource {
  readonly CPP_INTERVIEW_QUESTIONS?: unknown;
}

export class BrowserQuestionDataAdapter {
  constructor(private readonly source: BrowserQuestionSource) {}

  load(): Question[] {
    const rows = this.source.CPP_INTERVIEW_QUESTIONS;
    if (!Array.isArray(rows)) return [];
    return rows.flatMap((row) => {
      const question = normalize(row);
      return question ? [question] : [];
    });
  }
}

function normalize(value: unknown): Question | null {
  if (!isRecord(value)) return null;
  const input = {
    id: value.id,
    group: value.group,
    category: value.category,
    title: value.title,
    difficulty: value.difficulty,
    scopes: value.scopes,
    answer: value.answer,
    source: sanitizeSource(value.source),
    ...(value.pattern === undefined ? {} : { pattern: value.pattern })
  };
  try {
    return createQuestion(input);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeSource(value: unknown): unknown {
  return typeof value === 'string' ? stripUrls(value) : value;
}

function stripUrls(value: string): string {
  return value.replace(/https?:\/\/\S+/gi, '').replace(/\s{2,}/g, ' ').trim();
}
