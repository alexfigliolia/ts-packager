import type { CLIOptions } from "options/CLIOptions";

export type Build = "esm" | "commonjs" | "all";

export interface Preprocessor {
  options: CLIOptions;
  run: () => void | Promise<void>;
  cleanUp: () => void | Promise<void>;
}
