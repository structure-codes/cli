import fs from "fs";
import { cli } from "./cli";

test("Should be able to generate structure of given directory", () => {
  const result = cli(["../src/__tests__/testStructure"]);
  const testTree = fs.readFileSync("../src/__tests__/trees/test.tree").toString();
  expect(result.trim()).toEqual(testTree);
});