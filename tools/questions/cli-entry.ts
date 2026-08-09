import { parseArgs } from './argv-parser';
import {
  QuestionCommandRunner,
  type ConsolePort
} from './question-command-runner';
import type { FileSystemPort, QuestionDataPaths } from './question-store';

export function runCli(
  argv: readonly string[],
  fileSystem: FileSystemPort,
  output: ConsolePort,
  paths?: QuestionDataPaths
): number {
  try {
    const forwarded = argv[0] === '--' ? argv.slice(1) : argv;
    const command = parseArgs(forwarded.length > 0 ? forwarded : ['check']);
    return new QuestionCommandRunner(fileSystem, output, paths).run(command);
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}
