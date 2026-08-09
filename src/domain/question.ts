import { z } from 'zod';
import { Difficulty, type DifficultyValue } from './difficulty';

const questionGroups = ['cpp', 'gof', 'ue5', 'windows'] as const;
const authorities = [
  'cppreference',
  'iso-cpp',
  'wg21',
  'cpp-core-guidelines',
  'gnu-libstdcxx',
  'gof',
  'epic-games',
  'meta-developers',
  'microsoft-learn',
  'ietf-rfc'
] as const;

export type QuestionGroup = (typeof questionGroups)[number];
export type AnswerAuthority = (typeof authorities)[number];

export interface Question {
  readonly id: string;
  readonly group: QuestionGroup;
  readonly category: string;
  readonly title: string;
  readonly difficulty: DifficultyValue;
  readonly scopes: readonly string[];
  readonly answer: string;
  readonly source: string;
  readonly pattern?: string;
}

export type AuthoringQuestion = Omit<Question, 'source'> & {
  readonly answerSources: readonly AnswerSource[];
  readonly evidenceIds: readonly string[];
};

export interface AnswerSource {
  readonly authority: AnswerAuthority;
  readonly topic: string;
  readonly locator?: string;
  readonly url?: string;
}

export interface InterviewEvidence {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly sourceTitle: string;
  readonly url: string;
  readonly publishedAt?: string;
  readonly accessedAt: string;
  readonly reportedQuestion: string;
}

const text = z.string().trim().min(1);
const httpUrl = text.url().refine(
  (value) => /^https?:\/\//i.test(value),
  'URL must use http or https'
);
const dateText = text.refine(isIsoDate, 'Date must be a valid YYYY-MM-DD value');
const group = z.enum(questionGroups);
const authority = z.enum(authorities);

const answerSourceSchema = z.object({
  authority,
  topic: text,
  locator: httpUrl.optional(),
  url: httpUrl.optional()
}).strict();

const evidenceSchema = z.object({
  id: text,
  company: text,
  role: text,
  sourceTitle: text,
  url: httpUrl,
  publishedAt: dateText.optional(),
  accessedAt: dateText,
  reportedQuestion: text
}).strict();

const questionFields = {
  id: text,
  group,
  category: text,
  title: text,
  difficulty: z.number().int().min(1).max(5),
  scopes: z.array(text).min(1),
  answer: text,
  pattern: text.optional()
};

const authoringSchema = z.object({
  ...questionFields,
  answerSources: z.array(answerSourceSchema).min(1),
  evidenceIds: z.array(text).min(2).superRefine((ids, context) => {
    if (new Set(ids).size !== ids.length) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'evidenceIds must be unique' });
    }
  })
}).strict();

const runtimeSchema = z.object({
  ...questionFields,
  source: text.refine(
    (value) => !/(?:https?|ftp):\/\//i.test(value),
    'Runtime source must be text, not a URL'
  )
}).strict();

export function createAuthoringQuestion(input: unknown): AuthoringQuestion {
  const parsed = authoringSchema.parse(input);
  const value = {
    ...parsed,
    difficulty: Difficulty.from(parsed.difficulty).value,
    scopes: [...parsed.scopes],
    answerSources: parsed.answerSources.map((source) => ({ ...source })),
    evidenceIds: [...parsed.evidenceIds]
  };
  return deepFreeze(value) as AuthoringQuestion;
}

export function createInterviewEvidence(input: unknown): InterviewEvidence {
  const parsed = evidenceSchema.parse(input);
  return deepFreeze({ ...parsed }) as InterviewEvidence;
}

export function createQuestion(input: unknown): Question {
  const parsed = runtimeSchema.parse(input);
  const value = {
    ...parsed,
    difficulty: Difficulty.from(parsed.difficulty).value,
    scopes: [...parsed.scopes]
  };
  return deepFreeze(value) as Question;
}

export function createRuntimeQuestion(
  input: AuthoringQuestion,
  source: string
): Question {
  const parsed = authoringSchema.parse(input);
  const runtimeInput: Record<string, unknown> = {
    id: parsed.id,
    group: parsed.group,
    category: parsed.category,
    title: parsed.title,
    difficulty: Difficulty.from(parsed.difficulty).value,
    scopes: [...parsed.scopes],
    answer: parsed.answer,
    source
  };
  if (parsed.pattern !== undefined) runtimeInput.pattern = parsed.pattern;
  return createQuestion(runtimeInput);
}

function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach((child) => deepFreeze(child));
    Object.freeze(value);
  }
  return value;
}
