import { runCli } from './cli-entry';
import { nodeConsole, NodeFileSystem } from './node-adapters';

declare const process: {
  argv: string[];
  cwd(): string;
  exitCode: number;
};

const fileSystem = new NodeFileSystem(process.cwd());
process.exitCode = runCli(process.argv.slice(2), fileSystem, nodeConsole);
