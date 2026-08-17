import {
  createAuthoringQuestion,
  createInterviewEvidence,
  type AuthoringQuestion,
  type InterviewEvidence,
  type QuestionGroup
} from '../../src/domain/question';
import { buildRuntimeScript, validateQuestionSet } from './question-tools';

export interface FileSystemPort {
  readText(path: string): string;
  writeText(path: string, text: string): void;
  writeBatch(files: ReadonlyMap<string, string>): void;
}

export interface QuestionDataPaths {
  readonly questions: Readonly<Record<QuestionGroup, string>>;
  readonly evidence: string;
  readonly runtime: string;
}

export const DEFAULT_QUESTION_PATHS: QuestionDataPaths = {
  questions: {
    cpp: 'data/questions/cpp.json',
    gof: 'data/questions/gof.json',
    ue5: 'data/questions/ue5.json'
  },
  evidence: 'data/evidence/interviews.json',
  runtime: 'questions.js'
};

export interface LoadedQuestionData {
  readonly questions: readonly AuthoringQuestion[];
  readonly evidence: readonly InterviewEvidence[];
}

export class QuestionDataStore {
  constructor(
    private readonly fileSystem: FileSystemPort,
    private readonly paths: QuestionDataPaths = DEFAULT_QUESTION_PATHS
  ) {}

  load(): LoadedQuestionData {
    const questions = (Object.keys(this.paths.questions) as QuestionGroup[])
      .flatMap((group) => this.readQuestions(group, this.paths.questions[group]));
    const evidence = this.parseRecords(this.paths.evidence, createInterviewEvidence);
    this.assertValid(questions, evidence);
    return { questions, evidence };
  }

  readRuntime(): string {
    return this.fileSystem.readText(this.paths.runtime);
  }

  readJson(path: string): unknown {
    try {
      return JSON.parse(this.fileSystem.readText(path)) as unknown;
    } catch (error) {
      throw new Error(`Cannot read ${path}: ${errorMessage(error)}`);
    }
  }

  prepareWrite(
    questions: readonly AuthoringQuestion[],
    evidence: readonly InterviewEvidence[]
  ): ReadonlyMap<string, string> {
    const report = validateQuestionSet(questions, evidence);
    if (report.errors.length > 0) throw new Error(report.errors.join('\n'));
    const files = new Map<string, string>();
    (Object.keys(this.paths.questions) as QuestionGroup[]).forEach((group) => {
      const rows = questions.filter((question) => question.group === group);
      files.set(this.paths.questions[group], `${JSON.stringify(rows, null, 2)}\n`);
    });
    files.set(this.paths.evidence, `${JSON.stringify(evidence, null, 2)}\n`);
    files.set(this.paths.runtime, buildRuntimeScript(questions, evidence));
    return files;
  }

  write(files: ReadonlyMap<string, string>): void {
    this.fileSystem.writeBatch(files);
  }

  writeRuntime(text: string): void {
    this.fileSystem.writeText(this.paths.runtime, text);
  }

  private readArray(path: string): unknown[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.fileSystem.readText(path));
    } catch (error) {
      throw new Error(`Cannot read ${path}: ${errorMessage(error)}`);
    }
    if (!Array.isArray(parsed)) throw new Error(`${path} must contain an array`);
    return parsed;
  }

  private readQuestions(group: QuestionGroup, path: string): AuthoringQuestion[] {
    return this.parseRecords(path, createAuthoringQuestion).map((question) => {
      if (question.group !== group) {
        throw new Error(`${path}: expected group ${group} but found ${question.group} for question ${question.id}`);
      }
      return question;
    });
  }

  private parseRecords<T>(path: string, parse: (candidate: unknown) => T): T[] {
    return this.readArray(path).map((candidate, index) => {
      try {
        return parse(candidate);
      } catch (error) {
        throw new Error(`${path} record ${index + 1}: ${errorMessage(error)}`);
      }
    });
  }

  private assertValid(
    questions: readonly AuthoringQuestion[],
    evidence: readonly InterviewEvidence[]
  ): void {
    const report = validateQuestionSet(questions, evidence);
    if (report.errors.length > 0) throw new Error(report.errors.join('\n'));
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
