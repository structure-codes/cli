import * as fs from "fs";
import glob from "glob";
import path from "path";
import { treeJsonToString } from "./tree";

export const generateTree = (directory: string, options) => {
  const {
    silent,
    json,
    outputFile,
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
        if (!silent) console.log(`Writing data to ${outputFile}`);
        fs.writeFileSync(outputFile, treeString);
      }
      if (silent) return;
      if (json) {
        console.log(JSON.stringify(tree, null, 2));
      } else {
        console.log(treeString);
      }
    });
};
