import {
  createAuthoringQuestion,
  createInterviewEvidence,
  createRuntimeQuestion,
  type AnswerAuthority,
  type AnswerSource,
  type AuthoringQuestion,
  type InterviewEvidence
} from '../../src/domain/question';
import { checkQuestionContent } from './question-content-rules';
import { normalizeEvidenceUrl, validateInterviewEvidence } from './evidence-validator';

export interface ValidationReport {
  readonly errors: readonly string[];
  readonly counts: Readonly<Record<string, number>>;
}

export type QuestionChange =
  | { readonly action: 'add'; readonly question: Omit<AuthoringQuestion, 'id'> & { readonly id?: string } }
  | { readonly action: 'update'; readonly id: string; readonly patch: Partial<AuthoringQuestion> }
  | { readonly action: 'delete'; readonly id: string };

const cppScopes = new Set(['C++11', 'C++14', 'C++17']);
const authorityLabels: Record<AnswerAuthority, string> = {
  cppreference: 'cppreference',
  'iso-cpp': 'ISO C++',
  wg21: 'WG21',
  'cpp-core-guidelines': 'C++ Core Guidelines',
  'gnu-libstdcxx': 'GNU libstdc++',
  gof: 'GoF',
  'epic-games': 'Epic Games',
  'microsoft-learn': 'Microsoft Learn',
  'ietf-rfc': 'IETF RFC'
};

export function validateQuestionSet(
  questions: readonly unknown[],
  evidence: readonly unknown[]
): ValidationReport {
  const errors: string[] = [];
  const counts: Record<string, number> = {};
  const evidenceMap = parseEvidence(evidence, errors);
  const ids = new Set<string>();
  const titleKeys = new Set<string>();
  const answerKeys = new Set<string>();
  const suffixes = new Set<string>();

  questions.forEach((candidate, index) => {
    const question = parseQuestion(candidate, index, errors);
    if (!question) return;
    counts[question.group] = (counts[question.group] ?? 0) + 1;
    if (ids.has(question.id)) errors.push(`${question.id}: duplicate question id`);
    ids.add(question.id);
    checkQuestionUniqueness(question, titleKeys, answerKeys, suffixes, errors);
    checkQuestionEvidence(question, evidenceMap, errors);
    checkScopes(question, errors);
    errors.push(...checkQuestionContent(question));
  });
  return { errors, counts };
}

export function applyQuestionChanges(
  original: readonly AuthoringQuestion[],
  changes: readonly QuestionChange[]
): AuthoringQuestion[] {
  const next = original.map((question) => ({ ...question }));
  for (const change of changes) {
    if (change.action === 'add') {
      if (next.some((question) => question.id === change.question.id)) {
        throw new Error(`Cannot add duplicate question id ${change.question.id}`);
      }
      next.push(createAuthoringQuestion(change.question));
      continue;
    }
    const index = next.findIndex((question) => question.id === change.id);
    if (index < 0) throw new Error(`Unknown question id ${change.id}`);
    if (change.action === 'delete') {
      next.splice(index, 1);
    } else {
      next[index] = createAuthoringQuestion({ ...next[index], ...change.patch });
    }
  }
  return next;
}

export function buildRuntimeScript(
  questions: readonly AuthoringQuestion[],
  evidence: readonly InterviewEvidence[]
): string {
  const report = validateQuestionSet(questions, evidence);
  if (report.errors.length > 0) throw new Error(report.errors.join('\n'));
  const runtime = questions.map((question) => {
    const source = sourceLabel(question);
    return createRuntimeQuestion(question, source);
  });
  return `window.CPP_INTERVIEW_QUESTIONS = ${JSON.stringify(runtime, null, 2)};\n`;
}

function parseQuestion(
  candidate: unknown,
  index: number,
  errors: string[]
): AuthoringQuestion | undefined {
  try {
    return createAuthoringQuestion(candidate);
  } catch (error) {
    const message = errorMessage(error);
    if (message.includes('evidenceIds') || message.includes('at least 2')) {
      errors.push(`question ${index + 1}: needs two independent interview evidence records`);
    } else {
      errors.push(`question ${index + 1}: ${message}`);
    }
    return undefined;
  }
}

function parseEvidence(
  records: readonly unknown[],
  errors: string[]
): Map<string, InterviewEvidence> {
  const result = new Map<string, InterviewEvidence>();
  const urls = new Set<string>();
  records.forEach((record, index) => {
    try {
      const evidence = createInterviewEvidence(record);
      if (result.has(evidence.id)) errors.push(`evidence ${index + 1}: duplicate id ${evidence.id}`);
      result.set(evidence.id, evidence);
      errors.push(...validateInterviewEvidence(evidence, urls));
    } catch (error) {
      errors.push(`evidence ${index + 1}: ${errorMessage(error)}`);
    }
  });
  return result;
}

function checkQuestionUniqueness(
  question: AuthoringQuestion,
  titles: Set<string>,
  answers: Set<string>,
  suffixes: Set<string>,
  errors: string[]
): void {
  const titleKey = normalize(question.title);
  if (titles.has(titleKey)) errors.push(`${question.id}: duplicate normalized title`);
  titles.add(titleKey);
  const answerKey = normalize(question.answer);
  if (answers.has(answerKey)) errors.push(`${question.id}: duplicate normalized answer`);
  answers.add(answerKey);
  const suffix = question.title.split('：').slice(1).join('：').trim();
  if (suffix && suffixes.has(suffix)) errors.push(`${question.id}: repeated generated suffix`);
  if (suffix) suffixes.add(suffix);
}

function checkQuestionEvidence(
  question: AuthoringQuestion,
  evidence: Map<string, InterviewEvidence>,
  errors: string[]
): void {
  const ids = [...new Set(question.evidenceIds)];
  if (ids.length < 2) errors.push(`${question.id}: needs two independent interview evidence records`);
  const records = ids.map((id) => evidence.get(id));
  if (records.some((record) => !record)) errors.push(`${question.id}: references missing evidence`);
  const urls = new Set(records.filter(Boolean).map((record) => normalizeEvidenceUrl(record!.url)));
  if (urls.size < 2) errors.push(`${question.id}: evidence URLs must be independent`);
}

function checkScopes(question: AuthoringQuestion, errors: string[]): void {
  if (question.group === 'cpp' || question.group === 'gof') {
    if (question.scopes.some((scope) => !cppScopes.has(scope))) {
      errors.push(`${question.id}: invalid C++ scope`);
    }
  } else if (question.group === 'ue5' && !question.scopes.includes('UE5')) {
    errors.push(`${question.id}: UE5 scope is required`);
  } else if (question.group === 'windows'
    && !question.scopes.some((scope) => ['Win32', 'Winsock', 'IOCP'].includes(scope))) {
    errors.push(`${question.id}: Windows scope is required`);
  }
}

function sourceLabel(question: AuthoringQuestion): string {
  const labels = question.answerSources.map(formatAnswerSource);
  return `资料依据：${labels.join('；')}`;
}

export function formatAnswerSource(source: AnswerSource): string {
  return `${authorityLabels[source.authority]} · ${source.topic}`;
}

function normalize(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
