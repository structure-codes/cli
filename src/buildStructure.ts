import * as fs from "fs";
import path from "path";
import { treeStringToJson } from "./tree";
import isNondot from "@structure-codes/is-nondot";

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
    filepath: string;
    type: "file" | "dir";
  };
  const paths: Array<Path> = [];
  const searchTree = (tree: any, filepath: Array<string>) => {
    const branches = Object.keys(tree);
    if (branches.length === 0) {
      const leafName = filepath[filepath.length - 1];
      const type = leafName.includes(".") || isNondot(leafName) 
        ? "file" 
        : "dir";
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

export const buildStructure = (file, options) => {
  const { directory } = options;
  try {
    const data = fs.readFileSync(file);
    const tree = treeStringToJson(data.toString());
    const paths = getPaths(tree);
    const outputDirExists = pathExists(directory);
    if (!outputDirExists) {
      console.log("Creating target directory:", directory);
      fs.mkdirSync(directory, { recursive: true });
    }
    paths.forEach(({ filepath, type }: any) => {
      const fullPath = directory + "/" + filepath.replace(/\/+/g, "/");
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
        fs.writeFileSync(fullPath, "", { flag: "wx" });
      }
    });
  } catch (e: any) {
    console.error(e.message);
  }
};
