import { ChildProcess } from "@figliolia/child-process";
import { writeFileSync } from "fs";
import path from "path";
import type { CLIOptions } from "options";
import { Logger } from "logging";
import type { Build } from "./types";
import { PackageMod } from "./PackageMod";
import { BuildOverrides } from "./BuildOverrides";
import type { SpawnOptions } from "child_process";

export class Packager {
  private static readonly spawnOptions: SpawnOptions = {
    shell: true,
    stdio: "inherit",
  };
  private static readonly preProcessors = [PackageMod, BuildOverrides];
  constructor(private options: CLIOptions, private build: Build = "all") {}

  public async run() {
    const Processors = Packager.preProcessors.map(V => new V(this.options));
    await Promise.all(Processors.map(P => P.run()));
    await this.runBuild();
    return BuildOverrides.removeTMP();
  }

  private async runBuild() {
    await Packager.removeDIST();
    await this.buildTypes();
    switch (this.build) {
      case "commonjs":
        return this.buildCommon();
      case "esm":
        return this.buildESM();
      case "all":
        await this.buildCommon();
        return this.buildESM();
    }
  }

  public static removeDIST() {
    Logger.info("Deleting build folder");
    return new ChildProcess("rm -rf dist").handler;
  }

  private async buildESM() {
    Logger.info("Building ES Modules");
    await new ChildProcess(
      "npx tsc -p tmp/tsconfig.mjs.json && npx tsc-alias -p tmp/tsconfig.mjs.json",
      Packager.spawnOptions,
    ).handler;
    this.addESMRoot();
    return this.patchESMExtensions();
  }

  private async buildCommon() {
    Logger.info("Building Common JS");
    await new ChildProcess(
      "npx tsc -p tmp/tsconfig.cjs.json && npx tsc-alias -p tmp/tsconfig.cjs.json",
      Packager.spawnOptions,
    ).handler;
    return this.addCommonRoot();
  }

  private async buildTypes() {
    Logger.info("Building Type Declarations");
    return new ChildProcess(
      "npx tsc -p tmp/tsconfig.types.json && npx tsc-alias -p tmp/tsconfig.types.json",
      Packager.spawnOptions,
    ).handler;
  }

  private addESMRoot() {
    writeFileSync(
      path.resolve("dist/mjs/package.json"),
      this.format({
        type: "module",
        exports: "./index.js",
      }),
    );
  }

  private addCommonRoot() {
    writeFileSync(
      path.resolve("dist/cjs/package.json"),
      this.format({
        type: "commonjs",
      }),
    );
  }

  private format(record: Record<string, any>) {
    return JSON.stringify(record, null, 2);
  }

  private patchESMExtensions() {
    return ChildProcess.execute(
      "npx tsc-esm-fix --src='dist/mjs/**/*' --ext='.js'",
    );
  }
}
