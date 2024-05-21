import { dirname } from "path";
import { execCommand } from "./executeCommand";

export const getGitCommand = (): string => {
	// const vscodeGit = extensions.getExtension<GitExtension>("vscode.git");

	// if (vscodeGit?.exports.enabled) {
	// 	return vscodeGit.exports.getAPI(1).git.path;
	// }

	return "git";
};

export function getGitBlame(filePath: string): Promise<string> {
  const command = getGitCommand();
  const args = ['blame', "-C", "--incremental", "--", filePath];
  const opts = {cwd: dirname(filePath)};
  return execCommand(command, args, opts);
}

export function getGitShow(commitId: string, filePath: string): Promise<string> {
  const command = getGitCommand();
  const args = ["--no-pager", "show", commitId, "--", filePath];
  const opts = {cwd: dirname(filePath)};
  return execCommand(command, args, opts);
}

export function getGitBlameMinimal(filePath: string, startLine: number, endLine: number): Promise<string> {
  const command = getGitCommand();
  const args = ['--no-pager', 'blame', "-L", `${String(startLine)},${String(endLine)}`, "-t", "--", filePath];
  const opts = {cwd: dirname(filePath)};
  return execCommand(command, args, opts);
}

export function getGitRemote(filePath: string): Promise<string> {
  const command = getGitCommand();
  const args = ['remote', '-v'];
  const opts = {cwd: dirname(filePath)};
  return execCommand(command, args, opts);
}