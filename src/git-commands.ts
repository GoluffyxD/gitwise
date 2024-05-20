
// import { extensions } from "vscode";
// import type { GitExtension } from "./git";
import { execFile, spawn } from "child_process";
import { dirname } from "path";
import { promisify } from 'util';

export const getGitCommand = (): string => {
	// const vscodeGit = extensions.getExtension<GitExtension>("vscode.git");

	// if (vscodeGit?.exports.enabled) {
	// 	return vscodeGit.exports.getAPI(1).git.path;
	// }

	return "git";
};


// Promisify the execFile function
export const execFileAsync = promisify(execFile);

export async function getGitStatus(): Promise<string> {
  try {
    // Run the git status command
    const { stdout } = await execFileAsync('git', ['status']);
    
    // Return the stdout output
    return stdout;
  } catch (error) {
    // Handle errors (e.g., if git is not installed or not a git repository)
    throw new Error(`Error executing git status: ${error}`);
  }
}

export function getGitBlame(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const gitStatus = spawn('git', ['blame', "-C", "--incremental", "--", filePath], {
      cwd: dirname(filePath)
    });

    let output = '';

    gitStatus.stdout.on('data', (data) => {
      output += data.toString();
    });

    gitStatus.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    gitStatus.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Process exited with code ${code}`);
      }
    });
  });
}


