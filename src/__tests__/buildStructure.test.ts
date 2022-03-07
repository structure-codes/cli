import fs from "fs";
import { cli } from "./cli";

const tmpBase = process.platform === "win32" ? process.env.TEMP : "/tmp";
const tmpDir = `tree_${Date.now()}`;
const tmpPath = tmpBase + "/" + tmpDir;
const buildTree = "src/__tests__/trees/buildTest.tree";

test("Should be able to build structure from given tree file", () => {
  cli(["build", buildTree, tmpPath]);
  const treeResult = cli([tmpPath]);
  const testTree = fs.readFileSync(buildTree).toString();
  expect(treeResult.trim()).toEqual(testTree);
});

test("Should correctly create files and directories", () => {
  const license = fs.lstatSync(tmpPath + "/LICENSE");
  expect(license.isFile()).toBe(true);
  const gitignore = fs.lstatSync(tmpPath + "/.gitignore");
  expect(gitignore.isFile()).toBe(true);
  const src = fs.lstatSync(tmpPath + "/src");
  expect(src.isFile()).toBe(false);
  const emptyDir = fs.lstatSync(tmpPath + "/src/utils/emptyDir");
  expect(emptyDir.isFile()).toBe(false);
});