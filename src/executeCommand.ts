import { spawn } from "child_process";

export function execCommand(command: string, args: string[], opts: {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const commandExec = spawn(command, args, opts);
  
      let output = '';
  
      commandExec.stdout.on('data', (data) => {
        output += data.toString();
      });
  
      commandExec.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        reject(data.toString());
      });
  
      commandExec.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Process exited with code ${code}`);
        }
      });
    });
  }