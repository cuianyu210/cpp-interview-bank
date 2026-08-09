import type { AuthoringQuestion } from '../../src/domain/question';
import { matchesSearchText } from '../../src/application/text-search';
import { buildRuntimeScript, formatAnswerSource } from './question-tools';
import { parseArgs, type ParsedCommand } from './argv-parser';
import { prepareChangeBatch } from './change-batch';
import { QuestionDataStore, type FileSystemPort, type QuestionDataPaths } from './question-store';

export interface ConsolePort {
  log(message: string): void;
  error(message: string): void;
}

export class QuestionCommandRunner {
  private readonly store: QuestionDataStore;

  constructor(
    fileSystem: FileSystemPort,
    private readonly output: ConsolePort,
    paths?: QuestionDataPaths
  ) {
    this.store = new QuestionDataStore(fileSystem, paths);
  }

  run(argvOrCommand: readonly string[] | ParsedCommand): number {
    try {
      const command = isArgv(argvOrCommand) ? parseArgs(argvOrCommand) : argvOrCommand;
      return this.execute(command);
    } catch (error) {
      this.output.error(errorMessage(error));
      return 1;
    }
  }

  private execute(command: ParsedCommand): number {
    if (command.name === 'search') return this.search(command);
    if (command.name === 'evidence') return this.evidence(command.id);
    if (command.name === 'stats') return this.stats();
    if (command.name === 'apply') return this.apply(command);
    if (command.name === 'build') return this.build();
    if (command.name === 'check') return this.check();
    return assertNever(command);
  }

  private search(command: Extract<ParsedCommand, { name: 'search' }>): number {
    const data = this.store.load();
    const query = command.query?.trim() ?? '';
    const matches = data.questions.filter((question) => (
      (!command.group || question.group === command.group)
      && (!command.category || question.category === command.category)
      && matchesSearchText(searchableText(question), query)
    ));
    const result = command.full ? matches : matches.map(toSummary);
    this.output.log(JSON.stringify(result, null, 2));
    return 0;
  }

  private evidence(id: string): number {
    const data = this.store.load();
    const question = data.questions.find((candidate) => candidate.id === id);
    const result = question
      ? data.evidence.filter((record) => question.evidenceIds.includes(record.id))
      : data.evidence.filter((record) => record.id === id);
    if (result.length === 0) throw new Error(`No evidence found for ${id}`);
    this.output.log(JSON.stringify(result, null, 2));
    return 0;
  }

  private stats(): number {
    const data = this.store.load();
    const result = {
      totalQuestions: data.questions.length,
      evidenceRecords: data.evidence.length,
      evidenceCoverage: coverage(data.questions, data.evidence),
      companies: countBy(data.evidence, (record) => record.company),
      groups: countBy(data.questions, (question) => question.group),
      categories: countBy(data.questions, (question) => question.category),
      difficulties: countBy(data.questions, (question) => String(question.difficulty)),
      authorities: countBy(
        data.questions.flatMap((question) => question.answerSources),
        (source) => source.authority
      )
    };
    this.output.log(JSON.stringify(result, null, 2));
    return 0;
  }

  private apply(command: Extract<ParsedCommand, { name: 'apply' }>): number {
    const current = this.store.load();
    const batch = prepareChangeBatch(current, this.store.readJson(command.file));
    const files = this.store.prepareWrite(batch.questions, batch.evidence);
    if (!command.dryRun) this.store.write(files);
    this.output.log(JSON.stringify({ dryRun: command.dryRun, ...batch.summary }));
    return 0;
  }

  private build(): number {
    const data = this.store.load();
    const runtime = buildRuntimeScript(data.questions, data.evidence);
    this.store.writeRuntime(runtime);
    this.output.log(JSON.stringify({ built: true, questions: data.questions.length }));
    return 0;
  }

  private check(): number {
    const data = this.store.load();
    const expected = buildRuntimeScript(data.questions, data.evidence);
    if (this.store.readRuntime() !== expected) {
      throw new Error('Generated questions.js is stale; run build');
    }
    this.output.log(JSON.stringify({ ok: true, questions: data.questions.length }));
    return 0;
  }
}

function searchableText(question: AuthoringQuestion): string {
  return [question.id, question.title, question.category, question.group, question.answer]
    .join(' ');
}

function toSummary(question: AuthoringQuestion): Record<string, unknown> {
  return {
    id: question.id,
    title: question.title,
    category: question.category,
    difficulty: question.difficulty,
    evidenceCount: question.evidenceIds.length,
    answerSources: question.answerSources.map(formatAnswerSource)
  };
}

function countBy<T>(values: readonly T[], key: (value: T) => string): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    const name = key(value);
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});
}

function coverage(
  questions: readonly AuthoringQuestion[],
  evidence: readonly { readonly id: string; readonly url: string }[]
): { covered: number; total: number; percent: number } {
  const urls = new Map(evidence.map((record) => [record.id, record.url]));
  const covered = questions.filter((question) => {
    const linkedUrls = question.evidenceIds
      .map((id) => urls.get(id))
      .filter((url): url is string => Boolean(url));
    return new Set(linkedUrls).size >= 2;
  }).length;
  const total = questions.length;
  const percent = total === 0 ? 0 : Number(((covered / total) * 100).toFixed(1));
  return { covered, total, percent };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isArgv(value: readonly string[] | ParsedCommand): value is readonly string[] {
  return Array.isArray(value);
}

function assertNever(value: never): never {
  throw new Error(`Unsupported command: ${String(value)}`);
}
