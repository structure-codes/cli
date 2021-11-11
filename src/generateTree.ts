import * as fs from "fs";
import glob from "glob";
import path from "path";
import { treeJsonToString } from "./tree";
import { exec, execSync } from "child_process";

export const generateTree = (directory: string, options) => {
  const {
    silent,
    json,
    outputFile,
    editor,
  } = options;
  const absolutePath = path.resolve(directory);
  glob(absolutePath + "/**/*", 
    {
      dot: true,
      ignore: [
        "**/node_modules/**",
        "**/.git/**",
      ]
    }, 
    (err, matches) => {
      if (err) {
        return console.error(`Error searching for files in ${absolutePath}: ${err}`);
      }
      const tree = {};
      matches.forEach(match => {
        const path = match.replace(absolutePath, "");
        const levels = path.split("/");
        let curr = tree;
        levels.forEach(level => {
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
    });
};
