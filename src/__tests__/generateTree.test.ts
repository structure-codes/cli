import fs from "fs";
import { cli } from "./cli";

test("Should be able to generate structure of given directory", async () => {
  const result = await cli(["src/__tests__/testStructure"], ".");
  expect(result.stderr).toBe("");
  const testTree = fs.readFileSync("src/__tests__/trees/test.tree").toString();
  expect(result.stdout.trim()).toEqual(testTree);
});