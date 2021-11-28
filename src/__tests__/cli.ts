import { exec } from "child_process";

type ReturnType = {
  code: number;
  error: Error;
  stdout: string;
  stderr: string;
};

export const cli = (args, cwd): Promise<ReturnType> => {
  return new Promise((resolve) => {
    exec(`ts-node src/index ${args.join(" ")}`, { cwd }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      });
    });
  });
};