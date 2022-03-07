import * as fs from "fs";
import path from "path";
import { TreeType, treeStringToJson } from "@structure-codes/utils";
// @ts-ignore
import isNondot from "@structure-codes/is-nondot";
import { pathExists, validatePath } from "./utils/utils";

type Path = {
  filepath: string;
  type: "file" | "dir";
};

const getPaths = (tree: TreeType[]) => {
  const paths: Array<Path> = [];
  const searchTree = (tree: TreeType[], filepath: Array<string>) => {
    tree.forEach((branch) => {
      const newPath = [...filepath];
      newPath.push(branch.name);
      if (branch.children && branch.children.length > 0) return searchTree(branch.children, newPath);
      const type = branch.name.includes(".") || isNondot(branch.name) ? "file" : "dir";
      return paths.push({ filepath: newPath.join("/"), type });
    });
  };
  searchTree(tree, []);
  return paths;
};

export const buildStructure = (file: string, outputLocation: string) => {
  if (!validatePath(file, "file")) {
    console.log("Path is INVALID");
    return;
  }
  try {
    const data = fs.readFileSync(file);
    const tree: TreeType[] = treeStringToJson(data.toString());
    console.log("tree is: " + JSON.stringify(tree));
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
