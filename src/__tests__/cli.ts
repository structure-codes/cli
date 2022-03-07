import { execSync } from "child_process";
import { getConfigPath } from "../utils/utils";
import fs from "fs";

export const cli = (args: any): string => {
  // Validate config path exists and a config file is there
  // You must have a valid config file before runnning tests!
  // If you don't have one, run the CLI to generate it
  const configPath = getConfigPath();
  if (!configPath) throw new Error("Could not find config path");
  try {
    fs.readFileSync(configPath);
  } catch (err: any) {
    throw new Error(err.message + "\nBefore running tests you must have a valid .treerc file - try running the cli first");
  }
  
  try {
    const result = execSync(`ts-node src/index ${args.join(" ")}`);
    return result.toString();
  } catch (err: any) {
    console.error(err);
    return err.message;
  }
};