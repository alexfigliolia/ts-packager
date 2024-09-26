import type { CLIOptions } from "Options/CLIOptions";

export type Build = "esm" | "commonjs" | "all";

export interface Preprocessor {
  options: CLIOptions;
  run: () => void | Promise<void>;
}
