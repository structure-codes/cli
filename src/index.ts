#!/usr/bin/env node

import { Command } from "commander";
import { buildStructure } from "./buildStructure";
import { generateTree } from "./generateTree";
// @ts-ignore
import packageJson from "../package.json";
import { checkConfig } from "./utils/checkConfig";


(async () => {
  const program = new Command();
  program.version(packageJson.version, "-v, --version");
  
  // tree cli does 2 things
  // - Generate structure or .tree file from existing directory structure
  // - Use .tree file to build directory structure
  
  const collect = (value: string, previous: string[]) => {
    return previous.concat([value]);
  };
  
  // Check if config already exists, if not attempt to create it
  await checkConfig();
  
  program
    .argument("[directory]", "directory to build structure from", ".")
    .option("-o, --output <output>", "location where command output should be stored")
    // TODO: plz fix thx
    // .option("-d, --depth <depth>", "depth to search within the target directory")
    .option("-i, --ignore <ignore>", "ignore these patterns", collect, [])
    .option("-c, --config-ignore", "include patterns that are ignored by config")
    .option("-d, --dir-only", "ignore files in tree output")
    .option("-j, --json", "print tree in json format")
    .option("-e, --editor", "open structure in new vscode window")
    .option("-s, --silent", "do not print anything to the console")
    .action((directory, options) => {
      generateTree(directory, options);
    });
  
  // result is newly created dirs
  program
    .command("build")
    .argument("<file>", ".tree file to build structure from")
    .argument("[output]", "output directory to build structure in", ".")
    .action((file, output) => {
      buildStructure(file, output);
    });
  
  program.addHelpText('afterAll', `
  Examples:
    Output tree ignoring dist to file new.tree
    $ struct -i dist -o new.tree
    
    Build structure from src.tree in directory new-project
    $ struct build ./src.tree new-project
  `);
  
  program.parse(process.argv);
})();