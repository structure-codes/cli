/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/testStructure"],
  testRegex: ".*\\.test\\.ts$",
  testTimeout: 60000,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};