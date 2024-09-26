import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { ChildProcess } from "@figliolia/child-process";
import { Logger } from "Logging";
import type { CLIOptions } from "Options";
import type { Preprocessor } from "./types";

export class BuildOverrides implements Preprocessor {
  private includes: string;
  private static readonly commonCompilerOptions = {
    noEmit: false,
    composite: false,
    declaration: false,
  };
  constructor(public options: CLIOptions) {
    this.includes = path.resolve(options.get("entrypoint"));
  }

  public async run() {
    Logger.info("Creating build configurations");
    const TMP = await this.makeTMP();
    await Promise.all([
      this.makeBuild(TMP),
      this.makeCJS(TMP),
      this.makeESM(TMP),
      this.makeTypes(TMP),
    ]);
  }

  public static removeTMP() {
    Logger.info("Cleaning up temporary directories");
    return new ChildProcess("rm -rf tmp").handler;
  }

  public async makeTMP() {
    const project = this.options.get("project");
    const directory = path.join(project, "tmp");
    if (!existsSync(directory)) {
      await mkdir(directory);
    }
    return directory;
  }

  private makeBuild(directory: string) {
    return writeFile(
      path.join(directory, "tsconfig.build.json"),
      BuildOverrides.format({
        extends: "../tsconfig.json",
        compilerOptions: {
          noEmit: false,
          outDir: "../dist",
          composite: false,
        },
        include: [this.includes],
      }),
    );
  }

  private makeCJS(directory: string) {
    return writeFile(
      path.join(directory, "tsconfig.cjs.json"),
      BuildOverrides.format({
        extends: "./tsconfig.build.json",
        compilerOptions: {
          ...BuildOverrides.commonCompilerOptions,
          module: "commonjs",
          outDir: "../dist/cjs",
          target: "ES2015",
        },
        include: [this.includes],
      }),
    );
  }

  private makeESM(directory: string) {
    return writeFile(
      path.join(directory, "tsconfig.mjs.json"),
      BuildOverrides.format({
        extends: "./tsconfig.build.json",
        compilerOptions: {
          ...BuildOverrides.commonCompilerOptions,
          module: "esnext",
          outDir: "../dist/mjs",
          target: "esnext",
        },
        include: [this.includes],
      }),
    );
  }

  private makeTypes(directory: string) {
    return writeFile(
      path.join(directory, "tsconfig.types.json"),
      BuildOverrides.format({
        extends: "./tsconfig.build.json",
        compilerOptions: {
          noEmit: false,
          composite: false,
          declaration: true,
          emitDeclarationOnly: true,
          module: "esnext",
          outDir: "../dist/types",
          target: "esnext",
        },
        include: [this.includes],
      }),
    );
  }

  public static format(config: Record<string, any>) {
    return JSON.stringify(config, null, 2);
  }
}
