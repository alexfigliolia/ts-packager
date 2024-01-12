// import { compilerOptions } from "./tsconfig.json";
// import { pathsToModuleNameMapper } from "ts-jest";
import type { Config } from "jest";

// @ts-ignore
const config: Config = {
  preset: "ts-jest",
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  slowTestThreshold: 10,
  roots: ["<rootDir>"],
  // modulePaths: [compilerOptions.baseUrl],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  testMatch: ["**/__tests__/*.test.ts"],
};

export default config;
