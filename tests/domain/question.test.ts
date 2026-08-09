import { describe, expect, it } from 'vitest';
import {
  createAuthoringQuestion,
  createInterviewEvidence,
  createRuntimeQuestion
} from '../../src/domain/question';
import type {
  AnswerSource,
  AuthoringQuestion,
  InterviewEvidence,
  Question
} from '../../src/domain/question';

describe('question domain contracts', () => {
  const source: AnswerSource = {
    authority: 'cppreference',
    topic: 'RAII',
    locator: 'https://en.cppreference.com/w/cpp/language/raii',
    url: 'https://en.cppreference.com/w/cpp/language/raii'
  };
  const evidenceRecord = (id: string): InterviewEvidence => ({
    id,
    company: 'Example Studio',
    role: 'C++ Engineer',
    sourceTitle: 'Interview report',
    url: `https://example.test/${id}`,
    accessedAt: '2026-08-08',
    reportedQuestion: 'Explain RAII.'
  });
  const validInput = {
    id: 'q-001',
    group: 'cpp',
    category: 'cpp/lifetime-raii',
    title: 'What is RAII?',
    difficulty: 2,
    scopes: ['C++11', 'C++14', 'C++17'],
    answer: 'A lifetime-based resource management technique.',
    answerSources: [source],
    evidenceIds: ['evidence-001', 'evidence-002']
  } satisfies AuthoringQuestion;

  it('models authoring sources and evidence without leaking source URLs', () => {
    const answerSource: AnswerSource = {
      authority: 'cppreference',
      topic: 'RAII',
      locator: 'https://en.cppreference.com/w/cpp/language/raii',
      url: 'https://en.cppreference.com/w/cpp/language/raii'
    };
    const evidence: InterviewEvidence = {
      id: 'evidence-001',
      company: 'Example Studio',
      role: 'C++ Engineer',
      sourceTitle: 'Interview report',
      url: 'https://example.test/interview-001',
      accessedAt: '2026-08-08',
      reportedQuestion: 'Explain RAII.'
    };
    const authoring: AuthoringQuestion = {
      id: 'q-001',
      group: 'cpp',
      category: 'cpp/lifetime-raii',
      title: 'What is RAII?',
      difficulty: 2,
      scopes: ['C++11', 'C++14', 'C++17'],
      answer: 'A lifetime-based resource management technique.',
      answerSources: [answerSource],
      evidenceIds: [evidence.id, 'evidence-002']
    };
    const runtime: Question = {
      ...authoring,
      source: 'cppreference',
    };

    expect(authoring.answerSources[0].authority).toBe('cppreference');
    expect(authoring.evidenceIds).toEqual(['evidence-001', 'evidence-002']);
    expect(runtime.source).toBe('cppreference');
    expect('source' in authoring).toBe(false);
  });

  it('creates deeply frozen authoring and runtime questions', () => {
    const authoring = createAuthoringQuestion({
      ...validInput,
      answerSources: [source],
      evidenceIds: ['evidence-001', 'evidence-002']
    });
    const runtime = createRuntimeQuestion(authoring, 'cppreference: RAII');

    expect(Object.isFrozen(authoring)).toBe(true);
    expect(Object.isFrozen(authoring.answerSources)).toBe(true);
    expect(Object.isFrozen(authoring.answerSources[0])).toBe(true);
    expect(Object.isFrozen(authoring.evidenceIds)).toBe(true);
    expect(Object.isFrozen(runtime)).toBe(true);
    expect(Object.isFrozen(runtime.scopes)).toBe(true);
    expect(runtime.source).toBe('cppreference: RAII');
    expect('answerSources' in runtime).toBe(false);
    expect('evidenceIds' in runtime).toBe(false);
    expect(JSON.stringify(runtime)).not.toContain('https://');
    expect(() => (authoring.scopes as string[]).push('C++20')).toThrow(TypeError);
    expect(() => (runtime.scopes as string[]).push('C++20')).toThrow(TypeError);
  });

  it.each([
    ['group', { group: 'invalid' }],
    ['difficulty', { difficulty: 6 }],
    ['title', { title: '   ' }],
    ['evidence count', { evidenceIds: ['evidence-001'] }],
    ['duplicate evidence', { evidenceIds: ['evidence-001', 'evidence-001'] }]
  ])('rejects an invalid %s', (_label, patch) => {
    expect(() => createAuthoringQuestion({ ...validInput, ...patch })).toThrow();
  });

  it('rejects non-http maintenance URLs and malformed dates', () => {
    expect(() => createAuthoringQuestion({
      ...validInput,
      answerSources: [{ ...source, url: 'ftp://example.test/source' }],
      evidenceIds: ['evidence-001', 'evidence-002']
    })).toThrow();
    expect(() => createInterviewEvidence({
      ...evidenceRecord('evidence-001'),
      url: 'ftp://example.test/source'
    })).toThrow();
    expect(() => createInterviewEvidence({
      ...evidenceRecord('evidence-001'),
      accessedAt: '2026-02-30'
    })).toThrow();
  });

  it('rejects a runtime source that is a URL', () => {
    const authoring = createAuthoringQuestion({
      ...validInput,
      answerSources: [source],
      evidenceIds: ['evidence-001', 'evidence-002']
    });

    expect(() => createRuntimeQuestion(authoring, 'https://example.test/source')).toThrow();
  });
});
