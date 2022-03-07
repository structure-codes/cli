import { execSync } from "child_process";

export const cli = (args: any): string => {
  process.env.CI = "true";
  try {
    const result = execSync(`ts-node src/index -c ${args.join(" ")}`);
    return result.toString();
  } catch (err: any) {
    console.error(err);
    return err.message;
  }
};