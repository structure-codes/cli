import * as fs from "fs";
import glob from "glob";
import path from "path";
import { treeJsonToString } from "./tree";
import { exec, execSync } from "child_process";

const globOptions = ({ parentDir, ignored, configIgnore }) => {
  const defaultIgnore = configIgnore ? [] : ["node_modules", ".git"];
  const mergedIgnore = [...ignored, ...defaultIgnore].map((path) => `${parentDir}/**/${path}/**`);
  return {
    dot: true,
    ignore: mergedIgnore,
    strict: false,
  };
};

export const generateTree = (directory: string, options) => {
  const { silent, json, outputFile, editor, ignore: ignored, configIgnore } = options;
  const absolutePath = path.resolve(directory).replace(/\\/g, "/");

  glob(
    absolutePath + "/**/*",
    globOptions({ parentDir: absolutePath, ignored, configIgnore }),
    (err, matches) => {
      if (err) {
        return console.error(`Error searching for files in ${err.path}`);
      }
      if (!matches) {
        return console.error("No matches found");
      }
      const tree = {};
      matches.forEach((match) => {
        const path = match.replace(absolutePath, "");
        const levels = path.split("/");
        let curr = tree;
        levels.forEach((level) => {
          if (!level) return;
          if (!curr[level]) curr[level] = {};
          curr = curr[level];
        });
      });
      const treeString = treeJsonToString(tree);

      if (outputFile) {
        if (!silent) console.info(`Writing data to ${outputFile}`);
        fs.writeFileSync(outputFile, treeString);
      }

      if (!silent && json) {
        console.info(JSON.stringify(tree, null, 2));
      } else if (!silent) {
        console.info(treeString);
      }

      // Open generated tree in vscode if the user has it installed
      if (editor) {
        try {
          execSync("code --help");
        } catch {
          return console.warn("Could not find code binary on path.");
        }
        const tmpDir = process.platform === "win32" ? process.env.TEMP : "/tmp";
        const tmpFile = `${path.basename(absolutePath)}_${Date.now()}.tree`;
        const tmpPath = tmpDir + "/" + tmpFile;
        fs.writeFileSync(tmpPath, treeString);
        exec(`code ${tmpPath}`);
      }
    }
  );
};
