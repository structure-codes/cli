// import inquirer from "inquirer";
import * as fs from "fs";
import path from "path";
import { treeStringToJson } from "./tree";

const args = process.argv.slice(2);
const file = args[0];
const targetDir = (args[1] || "") + "/";

const dirExists = async (filepath: string) => {
  try {
    await fs.accessSync(filepath);
    return true;
  } catch {
    return false;
  }
};

const getPaths = (tree: any) => {
  const paths: Array<{}> = [];
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
(async () => {
  try {
    const data = fs.readFileSync(file);
    const tree = treeStringToJson(data.toString());
    const paths = getPaths(tree);
    const targetDirExists = await dirExists(targetDir);
    if (!targetDirExists) {
      await fs.mkdirSync(targetDir, { recursive: true });
    }
    paths.forEach(async ({ filepath, type }: any) => {
      if (type === "dir") {
        await fs.mkdirSync(targetDir + filepath, { recursive: true });
      } else {
        const dirname = path.dirname(filepath);
        const exist = await dirExists(dirname);
        if (!exist) {
          await fs.mkdirSync(targetDir + dirname, {recursive: true});
        }
        await fs.writeFileSync(targetDir + filepath, "");
      }
    });
    console.log(tree);
    console.log(paths);
  } catch (e: any) {
    console.error(e.message);
  }
})();
