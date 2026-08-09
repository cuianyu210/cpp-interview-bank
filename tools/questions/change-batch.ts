import {
  createInterviewEvidence,
  type AuthoringQuestion,
  type InterviewEvidence
} from '../../src/domain/question';
import { applyQuestionChanges, type QuestionChange } from './question-tools';
import type { LoadedQuestionData } from './question-store';

export interface ChangeBatchSummary {
  readonly added: number;
  readonly updated: number;
  readonly deleted: number;
  readonly evidenceAdded: number;
}

export interface PreparedChangeBatch {
  readonly questions: readonly AuthoringQuestion[];
  readonly evidence: readonly InterviewEvidence[];
  readonly summary: ChangeBatchSummary;
}

export function prepareChangeBatch(
  current: LoadedQuestionData,
  rawPatch: unknown
): PreparedChangeBatch {
  const patch = asPatch(rawPatch);
  const evidence = appendEvidence(current.evidence, patch.evidence);
  const changes = normalizeChanges(patch.changes, current.questions);
  return {
    questions: applyQuestionChanges(current.questions, changes),
    evidence,
    summary: {
      added: changes.filter((change) => change.action === 'add').length,
      updated: changes.filter((change) => change.action === 'update').length,
      deleted: changes.filter((change) => change.action === 'delete').length,
      evidenceAdded: evidence.length - current.evidence.length
    }
  };
}

interface PatchDocument {
  readonly changes: readonly unknown[];
  readonly evidence: readonly unknown[];
}

function asPatch(value: unknown): PatchDocument {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('apply file must contain an object');
  }
  const record = value as Record<string, unknown>;
  const changes = record.changes ?? record.questions ?? [];
  const evidence = record.evidence ?? record.addEvidence ?? [];
  if (!Array.isArray(changes) || !Array.isArray(evidence)) {
    throw new Error('apply changes and evidence must be arrays');
  }
  return { changes, evidence };
}

function appendEvidence(
  current: readonly InterviewEvidence[],
  additions: readonly unknown[]
): InterviewEvidence[] {
  const result = [...current];
  const ids = new Set(result.map((record) => record.id));
  additions.forEach((candidate) => {
    const evidence = createInterviewEvidence(candidate);
    if (ids.has(evidence.id)) throw new Error(`Duplicate evidence id ${evidence.id}`);
    ids.add(evidence.id);
    result.push(evidence);
  });
  return result;
}

function normalizeChanges(
  rawChanges: readonly unknown[],
  current: readonly AuthoringQuestion[]
): QuestionChange[] {
  const idState = createIdState(current);
  return rawChanges.map((candidate) => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      throw new Error('Each question change must be an object');
    }
    const record = candidate as Record<string, unknown>;
    if (record.action === 'add') return normalizeAdd(record, idState);
    if (record.action === 'update' || record.action === 'delete') {
      return normalizeExisting(record, idState.ids);
    }
    throw new Error(`Unknown question change action ${String(record.action)}`);
  });
}

function normalizeAdd(
  record: Record<string, unknown>,
  idState: QuestionIdState
): QuestionChange {
  if (!record.question || typeof record.question !== 'object' || Array.isArray(record.question)) {
    throw new Error('Add change requires a question object');
  }
  const question = { ...(record.question as Record<string, unknown>) };
  const supplied = typeof question.id === 'string' && question.id ? question.id : undefined;
  const id = supplied ?? takeNextId(idState);
  reserveId(idState, id);
  question.id = id;
  return { action: 'add', question: question as Omit<AuthoringQuestion, 'id'> & { id: string } };
}

function normalizeExisting(record: Record<string, unknown>, ids: Set<string>): QuestionChange {
  if (typeof record.id !== 'string' || !record.id) throw new Error(`${String(record.action)} requires an id`);
  if (!ids.has(record.id)) throw new Error(`Unknown question id ${record.id}`);
  if (record.action === 'delete') {
    ids.delete(record.id);
    return { action: 'delete', id: record.id };
  }
  const patch = record.patch;
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    throw new Error('Update change requires a patch object');
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'id')) {
    throw new Error('Update patch must not modify the stable id');
  }
  return { action: 'update', id: record.id, patch: patch as Partial<AuthoringQuestion> };
}

interface QuestionIdState {
  readonly ids: Set<string>;
  maximum: bigint;
}

function createIdState(questions: readonly AuthoringQuestion[]): QuestionIdState {
  return questions.reduce<QuestionIdState>((state, question) => {
    const value = decimalId(question.id);
    if (value !== undefined && value > state.maximum) state.maximum = value;
    state.ids.add(question.id);
    return state;
  }, { ids: new Set<string>(), maximum: 0n });
}

function reserveId(state: QuestionIdState, id: string): void {
  if (state.ids.has(id)) throw new Error(`Cannot add duplicate question id ${id}`);
  state.ids.add(id);
  const value = decimalId(id);
  if (value !== undefined && value > state.maximum) state.maximum = value;
}

function takeNextId(state: QuestionIdState): string {
  let id: string;
  do {
    state.maximum += 1n;
    id = state.maximum.toString().padStart(3, '0');
  } while (state.ids.has(id));
  return id;
}

function decimalId(id: string): bigint | undefined {
  return /^\d+$/.test(id) ? BigInt(id) : undefined;
}
