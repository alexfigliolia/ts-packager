import path from "path";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { Logger } from "logging";
import type { CLIOptions } from "options";
import type { Preprocessor } from "./types";
import { BuildOverrides } from "./BuildOverrides";

export class PackageMod implements Preprocessor {
  constructor(public options: CLIOptions) {}

  public async run() {
    Logger.info(
      "Modifying your package.json to correctly serve ESM and common.JS to your repository's consumers",
    );
    const packagePath = this.findPackageFile();
    const buffer = await readFile(packagePath);
    const packageFile = JSON.parse(buffer.toString());
    const mod = this.appendConfiguration(packageFile);
    await writeFile(packagePath, BuildOverrides.format(mod));
  }

  private findPackageFile() {
    const directory = this.options.get("project");
    let fixedPath = directory;
    if (!path.isAbsolute(fixedPath)) {
      fixedPath = path.join(process.cwd(), fixedPath);
    }
    const packageFile = path.join(fixedPath, "package.json");
    if (!existsSync(packageFile)) {
      Logger.error("I could not find your package.json. I checked here:");
      Logger.LOG(Logger.chalk.gray(packageFile));
      process.exit(0);
    }
    return packageFile;
  }

  private appendConfiguration(packageFile: Record<string, any>) {
    const config = this.buildConfiguration;
    if (!config) {
      return {};
    }
    return Object.assign({}, packageFile, config);
  }

  private get buildConfiguration() {
    switch (this.options.get("command")) {
      case "build-all":
        return PackageMod.buildAll;
      case "build-common":
        return PackageMod.buildCommon;
      case "build-esm":
        return PackageMod.buildESM;
    }
  }

  private static get buildAll() {
    return {
      exports: {
        ".": {
          import: "./dist/mjs/index.js",
          require: "./dist/cjs/index.js",
          types: "./dist/types/index.d.ts",
        },
      },
      main: "dist/cjs/index.js",
      module: "dist/mjs/index.js",
      types: "dist/types/index.d.ts",
    };
  }

  private static get buildESM() {
    return {
      main: "dist/esm/index.js",
      module: "dist/esm/index.js",
      types: "dist/types/index.d.ts",
    };
  }

  private static get buildCommon() {
    return {
      main: "dist/cjs/index.js",
      types: "dist/types/index.d.ts",
    };
  }
}
