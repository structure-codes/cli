import * as fs from "fs";
import path from "path";
import { treeStringToJson } from "./tree";
import { Command } from "commander";

const program = new Command();
program
  .requiredOption("-f, --file <file>", ".tree file to build structure from")
  .option("-t, --target-dir <targetDir>", "target directory to build structure in", ".");

program.parse(process.argv);
const opts = program.opts();
const file = opts.file;
const targetDir = opts.targetDir + "/";

const pathExists = (filepath: string) => {
  try {
    fs.accessSync(filepath);
    return true;
  } catch {
    return false;
  }
};

const getPaths = (tree: any) => {
  type Path = {
    filepath: string,
    type: 'file' | 'dir',
  }
  const paths: Array<Path> = [];
  const searchTree = (tree: any, filepath: Array<string>) => {
    const branches = Object.keys(tree);
    if (branches.length === 0) {
      const leafName = filepath[filepath.length - 1];
      const type = leafName.includes(".") ? "file" : "dir";
      const currentPath = filepath.join("/");

      return paths.push({ filepath: currentPath, type });
    }
    branches.forEach((branch) => {
      const newPath = [...filepath];
      newPath.push(branch);
      searchTree(tree[branch], newPath);
    });
  };
  searchTree(tree, []);
  return paths;
};

try {
  const data = fs.readFileSync(file);
  const tree = treeStringToJson(data.toString());
  const paths = getPaths(tree);
  const targetDirExists = pathExists(targetDir);
  if (!targetDirExists) {
    console.log("Creating target directory:", targetDir);
    fs.mkdirSync(targetDir, { recursive: true });
  }
  paths.forEach(({ filepath, type }: any) => {
    const fullPath = targetDir + filepath.replace(/\/+/g, "/");
    if (pathExists(fullPath)) {
      console.warn("Path already exists:", fullPath);
      return;
    }
    if (type === "dir") {
      console.log("Creating directory:", fullPath);
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      const dirname = path.dirname(fullPath);
      const exist = pathExists(dirname);
      if (!exist) {
        console.log("Creating directory:", dirname);
        fs.mkdirSync(dirname, { recursive: true });
      }
      console.log("Creating file:", fullPath);
      fs.writeFileSync(fullPath, "", {flag: "wx"});
    }
  });
} catch (e: any) {
  console.error(e.message);
}