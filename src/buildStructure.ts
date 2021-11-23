import * as fs from "fs";
import path from "path";
import { treeStringToJson } from "@structure-codes/utils";
import isNondot from "@structure-codes/is-nondot";
import { pathExists, validatePath } from "./utils";

const getPaths = (tree: any) => {
  type Path = {
    filepath: string;
    type: "file" | "dir";
  };
  const paths: Array<Path> = [];
  const searchTree = (tree: any, filepath: Array<string>) => {
    const branches = Object.keys(tree);
    // If length is 1, then the only thing there is the index which should be skipped
    if (branches.length === 1) {
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

export const buildStructure = (file, outputLocation) => {
  if (!validatePath(file, "file")) return;
  try {
    const data = fs.readFileSync(file);
    const tree = treeStringToJson(data.toString());
    const paths = getPaths(tree);

    if (!pathExists(outputLocation)) {
      console.log("Creating target directory:", outputLocation);
      fs.mkdirSync(outputLocation, { recursive: true });
    }

    paths.forEach(({ filepath, type }: any) => {
      const fullPath = outputLocation + "/" + filepath.replace(/\/+/g, "/");

      if (pathExists(fullPath)) {
        console.warn("Path already exists:", fullPath);
        return;
      }
      
      if (type === "dir") {
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        const dirname = path.dirname(fullPath);
        const exist = pathExists(dirname);
        if (!exist) {
          fs.mkdirSync(dirname, { recursive: true });
        }
        fs.writeFileSync(fullPath, "", { flag: "wx" });
      }
    });
  } catch (e: any) {
    console.error(e.message);
  }
};
