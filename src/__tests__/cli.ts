import { execSync } from "child_process";

export const cli = (args): string => {
  try {
    const result = execSync(`ts-node src/index ${args.join(" ")}`);
    return result.toString();
  } catch (err) {
    console.error(err);
    return err.message;
  }
};