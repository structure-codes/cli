#!/usr/bin/node

import { Command } from "commander";
import { buildStructure } from "./buildStructure";
import { generateTree } from "./generateTree";
import path from "path";

const program = new Command();
// tree cli does 2 things
// - Generate .tree file from existing directory structure
// - Use .tree file to build directory structure

// result is a .tree file
program
  .command("gen")
  .argument("[directory]", "directory to build structure from", ".")
  .option("-o, --output-file <outputFile>", "file to put tree structure in")
  .option("-j, --json", "print tree in json format")
  .option("-s, --silent", "do not print anything to the console")
  .action((directory, options) => {
    generateTree(directory, options);
  });

// result is newly created dirs
program
  .command("build")
  .argument("<file>", ".tree file to build structure from")
  .option("-o, --output-dir <outputDir>", "output directory to build structure in", ".")
  .action((file, { outputDir }) => {
    buildStructure(file, outputDir);
  });

program.parse(process.argv);


