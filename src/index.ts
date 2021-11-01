import * as fs from "fs";
import path from "path";
import { treeStringToJson } from "./tree";
import { Command } from "commander";

const program = new Command();
program
  .requiredOption("-f, --file <file>", ".tree file to build structure from")
  .option("-t, --target-dir <targetDir>", "target directory to build structure in", ".");

program.parse(process.argv);
const { file, targetDir } = program.opts();

const dirExists = (filepath: string) => {
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
  const targetDirExists = dirExists(targetDir);
  if (!targetDirExists) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  paths.forEach(async ({ filepath, type }: any) => {
    if (type === "dir") {
      await fs.mkdirSync(targetDir + "/" + filepath, { recursive: true });
    } else {
      const dirname = path.dirname(filepath);
      const exist = await dirExists(dirname);
      if (!exist) {
        await fs.mkdirSync(targetDir + "/" + dirname, { recursive: true });
      }
      await fs.writeFileSync(targetDir + "/" + filepath, "");
    }
  });
  console.log(tree);
  console.log(paths);
} catch (e: any) {
  console.error(e.message);
}