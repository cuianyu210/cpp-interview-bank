import type { QuestionGroup } from '../../src/domain/question';

export type ParsedCommand =
  | { readonly name: 'search'; readonly query?: string; readonly group?: QuestionGroup; readonly category?: string; readonly full: boolean }
  | { readonly name: 'evidence'; readonly id: string }
  | { readonly name: 'stats' }
  | { readonly name: 'apply'; readonly file: string; readonly dryRun: boolean }
  | { readonly name: 'build' }
  | { readonly name: 'check' };

export function parseArgs(argv: readonly string[]): ParsedCommand {
  const [name, ...tokens] = argv;
  if (!name) throw new Error('Command is required');
  if (name === 'search') return parseSearch(tokens);
  if (name === 'evidence') return parseEvidence(tokens);
  if (name === 'stats') return parseNoOptions(name, tokens);
  if (name === 'apply') return parseApply(tokens);
  if (name === 'build') return parseNoOptions(name, tokens);
  if (name === 'check') return parseNoOptions(name, tokens);
  throw new Error(`Unknown command: ${name}`);
}

function parseSearch(tokens: readonly string[]): ParsedCommand {
  const options = readOptions(tokens, new Set(['query', 'group', 'category', 'full']));
  const group = parseOptionalGroup(options.group);
  return {
    name: 'search',
    query: options.query,
    group,
    category: options.category,
    full: options.full === 'true'
  };
}

function parseEvidence(tokens: readonly string[]): ParsedCommand {
  const options = readOptions(tokens, new Set(['id']));
  if (!options.id) throw new Error('evidence requires --id');
  return { name: 'evidence', id: options.id };
}

function parseApply(tokens: readonly string[]): ParsedCommand {
  const options = readOptions(tokens, new Set(['file', 'dry-run']));
  if (!options.file) throw new Error('apply requires --file');
  return { name: 'apply', file: options.file, dryRun: options.dryRun === 'true' };
}

function parseNoOptions(name: 'stats' | 'build' | 'check', tokens: readonly string[]): ParsedCommand {
  if (tokens.length > 0) throw new Error(`${name} does not accept options`);
  return { name };
}

function readOptions(tokens: readonly string[], allowed: ReadonlySet<string>): Record<string, string> {
  const options: Record<string, string> = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (!allowed.has(key)) throw new Error(`Unknown option --${key}`);
    if (key === 'full' || key === 'dry-run') {
      options[key === 'dry-run' ? 'dryRun' : key] = 'true';
      continue;
    }
    const value = tokens[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Option --${key} requires a value`);
    options[key] = value;
    index += 1;
  }
  return options;
}

export function isQuestionGroup(value: string): value is QuestionGroup {
  return ['cpp', 'gof', 'ue5'].includes(value);
}

function parseOptionalGroup(value: string | undefined): QuestionGroup | undefined {
  if (value === undefined) return undefined;
  if (!isQuestionGroup(value)) throw new Error(`Unknown question group: ${value}`);
  return value;
}
